import { Box, Heading, Text, Card, CardBody, Button, Flex, Progress, Badge, VStack, HStack, IconButton } from '@chakra-ui/react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useRutinaStore } from '../store/rutinaStore'
import { useState, useEffect, useRef } from 'react'
import { FaPlay, FaPause, FaStop, FaArrowLeft } from 'react-icons/fa'

export default function EjecutarRutina() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { rutinas } = useRutinaStore()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentEjercicioIndex, setCurrentEjercicioIndex] = useState(0)
  const [currentSerie, setCurrentSerie] = useState(1)
  const [isResting, setIsResting] = useState(false)
  const [restTimeLeft, setRestTimeLeft] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const restIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isStoppedRef = useRef<boolean>(false)
  const femaleVoiceRef = useRef<SpeechSynthesisVoice | null>(null)

  const rutina = rutinas.find((r) => r.id === id)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
      
      // Función para obtener voz femenina en español
      const getFemaleVoice = () => {
        const voices = window.speechSynthesis.getVoices()
        
        // Buscar voces femeninas en español
        // Nombres comunes de voces femeninas en diferentes navegadores
        const femaleVoiceNames = [
          'maría', 'maria', 'monica', 'mónica', 'sofía', 'sofia',
          'esperanza', 'soledad', 'helena', 'laura', 'carmen', 'sabina',
          'elsa', 'zira', 'google español', 'microsoft helena', 
          'microsoft sabina', 'microsoft zira', 'microsoft elsa',
          'es-es-helena', 'es-es-sabina', 'es-mx-sabina'
        ]
        
        // Primero buscar por nombre exacto (case insensitive)
        let voice = voices.find(v => {
          const voiceName = v.name.toLowerCase()
          return femaleVoiceNames.some(name => 
            voiceName.includes(name.toLowerCase())
          ) && v.lang.startsWith('es')
        })
        
        // Si no se encuentra, buscar cualquier voz en español que suene femenina
        if (!voice) {
          voice = voices.find(v => {
            const voiceName = v.name.toLowerCase()
            return v.lang.startsWith('es') && 
              (voiceName.includes('female') || 
               voiceName.includes('woman') ||
               voiceName.includes('mujer') ||
               voiceName.includes('femenina'))
          })
        }
        
        // Si aún no se encuentra, buscar cualquier voz en español
        // pero preferir las que no sean masculinas
        if (!voice) {
          const esVoices = voices.filter(v => v.lang.startsWith('es'))
          // Excluir voces masculinas conocidas
          voice = esVoices.find(v => {
            const voiceName = v.name.toLowerCase()
            return !voiceName.includes('diego') && 
                   !voiceName.includes('pablo') &&
                   !voiceName.includes('male') &&
                   !voiceName.includes('man') &&
                   !voiceName.includes('hombre')
          }) || esVoices[0] // Si no hay, tomar la primera disponible
        }
        
        return voice || null
      }
      
      // Cargar voces (puede tomar un momento)
      const loadVoices = () => {
        const voice = getFemaleVoice()
        if (voice) {
          femaleVoiceRef.current = voice
        }
      }
      
      // Intentar cargar voces inmediatamente
      loadVoices()
      
      // Algunos navegadores cargan las voces de forma asíncrona
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    }
    
    return () => {
      if (restIntervalRef.current) {
        clearInterval(restIntervalRef.current)
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  if (!rutina) {
    return (
      <Box textAlign="center" py={12}>
        <Heading mb={4}>Rutina no encontrada</Heading>
        <Button as={Link} to="/rutinas">Volver a Rutinas</Button>
      </Box>
    )
  }

  const speak = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!synthRef.current || isStoppedRef.current) {
        resolve()
        return
      }

      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'es-ES'
      utterance.rate = 0.85 // Más lento para sonar más dulce
      utterance.pitch = 1.2 // Más alto para sonar más dulce y suave
      utterance.volume = 1
      
      // Asignar voz femenina si está disponible
      if (femaleVoiceRef.current) {
        utterance.voice = femaleVoiceRef.current
      }

      utterance.onend = () => {
        if (!isStoppedRef.current) {
          resolve()
        }
      }

      utterance.onerror = () => {
        resolve()
      }

      utteranceRef.current = utterance
      synthRef.current.speak(utterance)
    })
  }

  const startRest = (seconds: number): Promise<void> => {
    return new Promise((resolve) => {
      setIsResting(true)
      setRestTimeLeft(seconds)

      let timeLeft = seconds
      restIntervalRef.current = setInterval(() => {
        timeLeft--
        setRestTimeLeft(timeLeft)

        if (timeLeft <= 0) {
          if (restIntervalRef.current) {
            clearInterval(restIntervalRef.current)
          }
          setIsResting(false)
          resolve()
        }
      }, 1000)
    })
  }

  const ejecutarEjercicio = async (ejercicioIndex: number, serie: number) => {
    // Verificar si se detuvo
    if (isStoppedRef.current) {
      return
    }

    if (ejercicioIndex >= rutina.ejercicios.length) {
      if (!isStoppedRef.current) {
        await speak('¡Felicidades! Has completado toda la rutina. ¡Excelente trabajo!')
        setIsCompleted(true)
        setIsPlaying(false)
      }
      return
    }

    // Actualizar estado actual
    setCurrentEjercicioIndex(ejercicioIndex)
    setCurrentSerie(serie)

    const ejercicio = rutina.ejercicios[ejercicioIndex]
    const isLastSerie = serie === ejercicio.series

    // Anunciar el ejercicio
    if (serie === 1 && !isStoppedRef.current) {
      await speak(`Ejercicio ${ejercicioIndex + 1}: ${ejercicio.nombre}`)
      if (!isStoppedRef.current) {
        await speak(ejercicio.descripcion)
      }
    }

    if (isStoppedRef.current) return

    // Anunciar la serie
    await speak(`Serie ${serie} de ${ejercicio.series}`)
    if (!isStoppedRef.current) {
      await speak(`Realiza ${ejercicio.repeticiones} repeticiones`)
    }

    if (isStoppedRef.current) return

    // Esperar a que el usuario complete la serie
    // En una implementación real, podrías agregar un botón "Completé la serie"
    // Por ahora, esperamos 3 segundos simulando el tiempo de ejecución
    await new Promise(resolve => setTimeout(resolve, 3000))

    if (isStoppedRef.current) return

    // Si no es la última serie, descanso
    if (!isLastSerie) {
      await speak(`Descansa ${ejercicio.descanso} segundos`)
      if (!isStoppedRef.current) {
        await startRest(ejercicio.descanso)
      }
      if (!isStoppedRef.current) {
        await ejecutarEjercicio(ejercicioIndex, serie + 1)
      }
    } else {
      // Si es el último ejercicio, terminar
      if (ejercicioIndex === rutina.ejercicios.length - 1) {
        if (!isStoppedRef.current) {
          await ejecutarEjercicio(ejercicioIndex + 1, 1)
        }
      } else {
        // Pasar al siguiente ejercicio
        if (!isStoppedRef.current) {
          await speak('Siguiente ejercicio')
        }
        if (!isStoppedRef.current) {
          await ejecutarEjercicio(ejercicioIndex + 1, 1)
        }
      }
    }
  }

  const handleStart = async () => {
    isStoppedRef.current = false
    setIsPlaying(true)
    setIsCompleted(false)
    setCurrentEjercicioIndex(0)
    setCurrentSerie(1)
    setIsResting(false)
    setRestTimeLeft(0)

    await speak(`Comenzando la rutina: ${rutina.nombre}`)
    if (!isStoppedRef.current) {
      await speak(`Vamos a realizar ${rutina.ejercicios.length} ejercicios`)
    }
    if (!isStoppedRef.current) {
      await speak('¡Preparados, listos, ya!')
    }
    
    if (!isStoppedRef.current) {
      await ejecutarEjercicio(0, 1)
    }
  }

  const handlePause = () => {
    if (synthRef.current) {
      synthRef.current.pause()
    }
    if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current)
    }
    setIsPlaying(false)
  }

  const handleResume = () => {
    if (synthRef.current) {
      synthRef.current.resume()
    }
    setIsPlaying(true)
    // Continuar con el ejercicio actual
    ejecutarEjercicio(currentEjercicioIndex, currentSerie)
  }

  const handleStop = () => {
    isStoppedRef.current = true
    
    if (synthRef.current) {
      synthRef.current.cancel()
    }
    if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current)
      restIntervalRef.current = null
    }
    
    setIsPlaying(false)
    setIsResting(false)
    setRestTimeLeft(0)
    setIsCompleted(false)
    
    // Anunciar que se detuvo (después de un pequeño delay para que se cancele primero)
    setTimeout(() => {
      if (synthRef.current) {
        const utterance = new SpeechSynthesisUtterance('Rutina detenida')
        utterance.lang = 'es-ES'
        utterance.rate = 0.85
        utterance.pitch = 1.2
        if (femaleVoiceRef.current) {
          utterance.voice = femaleVoiceRef.current
        }
        synthRef.current.speak(utterance)
      }
    }, 200)
  }

  const currentEjercicio = rutina.ejercicios[currentEjercicioIndex]
  const progress = rutina.ejercicios.length > 0 
    ? ((currentEjercicioIndex + (currentSerie - 1) / (currentEjercicio?.series || 1)) / rutina.ejercicios.length) * 100 
    : 0

  return (
    <Box>
      <Flex align="center" gap={4} mb={6}>
        <Button as={Link} to={`/rutinas/${id}`} leftIcon={<FaArrowLeft />} variant="ghost">
          Volver
        </Button>
        <Heading flex={1} size="xl">Ejecutar: {rutina.nombre}</Heading>
      </Flex>

      <Card mb={6}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Box>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">Progreso</Text>
                <Text fontSize="sm" color="gray.600">
                  {Math.round(progress)}%
                </Text>
              </Flex>
              <Progress value={progress} colorScheme="blue" size="lg" borderRadius="md" />
            </Box>

            {currentEjercicio && (
              <Box>
                <Text fontSize="sm" color="gray.600" mb={2}>Ejercicio actual</Text>
                <Heading size="md" mb={2}>{currentEjercicio.nombre}</Heading>
                <Text fontSize="sm" color="gray.600" mb={3}>{currentEjercicio.descripcion}</Text>
                <HStack spacing={2}>
                  <Badge colorScheme="blue">Serie {currentSerie} de {currentEjercicio.series}</Badge>
                  <Badge colorScheme="green">{currentEjercicio.repeticiones} repeticiones</Badge>
                  {isResting && (
                    <Badge colorScheme="orange">Descanso: {restTimeLeft}s</Badge>
                  )}
                </HStack>
              </Box>
            )}

            {isCompleted && (
              <Box p={4} bg="green.50" borderRadius="md" border="1px" borderColor="green.200">
                <Text color="green.700" fontWeight="semibold" textAlign="center">
                  ¡Rutina completada! 🎉
                </Text>
              </Box>
            )}

            <Flex gap={4} justify="center" mt={4} wrap="wrap">
              {!isPlaying && !isCompleted && (
                <Button
                  leftIcon={<FaPlay />}
                  colorScheme="green"
                  size="lg"
                  onClick={handleStart}
                >
                  Iniciar Rutina
                </Button>
              )}
              
              {isPlaying && (
                <>
                  <Button
                    leftIcon={<FaPause />}
                    colorScheme="yellow"
                    size="lg"
                    onClick={handlePause}
                  >
                    Pausar
                  </Button>
                  <Button
                    leftIcon={<FaStop />}
                    colorScheme="red"
                    size="lg"
                    onClick={handleStop}
                    variant="solid"
                  >
                    Detener Ejercicio
                  </Button>
                </>
              )}

              {!isPlaying && !isCompleted && currentEjercicioIndex > 0 && (
                <Button
                  leftIcon={<FaPlay />}
                  colorScheme="blue"
                  size="lg"
                  onClick={handleResume}
                >
                  Continuar
                </Button>
              )}

              {isCompleted && (
                <Button
                  as={Link}
                  to={`/rutinas/${id}`}
                  colorScheme="blue"
                  size="lg"
                >
                  Volver a la Rutina
                </Button>
              )}
            </Flex>
          </VStack>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Heading size="md" mb={4}>Lista de Ejercicios</Heading>
          <VStack spacing={3} align="stretch">
            {rutina.ejercicios.map((ejercicio, index) => (
              <Box
                key={ejercicio.id}
                p={3}
                borderRadius="md"
                bg={index === currentEjercicioIndex ? 'blue.50' : 'gray.50'}
                border={index === currentEjercicioIndex ? '2px solid' : '1px solid'}
                borderColor={index === currentEjercicioIndex ? 'blue.300' : 'gray.200'}
              >
                <Flex justify="space-between" align="start">
                  <Box>
                    <Text fontWeight="semibold">
                      {index + 1}. {ejercicio.nombre}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {ejercicio.series} series × {ejercicio.repeticiones} repeticiones
                    </Text>
                  </Box>
                  {index < currentEjercicioIndex && (
                    <Badge colorScheme="green">Completado</Badge>
                  )}
                  {index === currentEjercicioIndex && isPlaying && (
                    <Badge colorScheme="blue">En progreso</Badge>
                  )}
                </Flex>
              </Box>
            ))}
          </VStack>
        </CardBody>
      </Card>
    </Box>
  )
}

