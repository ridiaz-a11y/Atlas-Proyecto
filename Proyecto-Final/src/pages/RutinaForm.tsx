import { Box, Heading, Card, CardBody, FormControl, FormLabel, Input, Textarea, Select, Button, Flex, Alert, AlertIcon, Spinner, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Text } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useRutinaStore } from '../store/rutinaStore'
import { RutinaFormData } from '../types'
import { FaArrowLeft, FaRobot } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { generarRutinaConIA } from '../services/aiService'

export default function RutinaForm() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const { rutinas, addRutina, updateRutina } = useRutinaStore()
  const isEditing = !!id
  const rutina = isEditing ? rutinas.find((r) => r.id === id) : null
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiParams, setAiParams] = useState({
    objetivo: '',
    dificultad: 'intermedio' as 'principiante' | 'intermedio' | 'avanzado',
    duracion: 45,
    diasSemana: 3
  })

  const { register, handleSubmit, formState: { errors } } = useForm<RutinaFormData>({
    defaultValues: rutina ? {
      nombre: rutina.nombre,
      descripcion: rutina.descripcion,
      dificultad: rutina.dificultad
    } : undefined
  })

  const onSubmit = (data: RutinaFormData) => {
    if (isEditing && id) {
      updateRutina(id, data)
    } else {
      addRutina({
        ...data,
        ejercicios: [],
        duracion: 0
      })
    }
    navigate('/rutinas')
  }

  const handleGenerarConIA = async () => {
    if (!aiParams.objetivo.trim()) {
      setAiError('Por favor ingresa un objetivo para tu rutina')
      return
    }

    setIsGenerating(true)
    setAiError(null)

    try {
      const rutinaGenerada = await generarRutinaConIA(aiParams)
      
      // Guardar la rutina directamente con los ejercicios, marcándola como generada con IA
      addRutina(rutinaGenerada, true)

      onClose()
      navigate('/rutinas')
    } catch (error) {
      setAiError('Error al generar la rutina. Por favor intenta de nuevo.')
      console.error('Error generando rutina:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Box>
      <Flex align="center" gap={4} mb={6}>
        <Button as={Link} to={isEditing ? `/rutinas/${id}` : '/rutinas'} leftIcon={<FaArrowLeft />} variant="ghost">
          Volver
        </Button>
        <Heading size="xl">
          {isEditing ? 'Editar Rutina' : 'Nueva Rutina'}
        </Heading>
      </Flex>

      {!isEditing && (
        <Card mb={6} bg="teal.50" borderColor="teal.200">
          <CardBody>
            <Flex align="center" justify="space-between">
              <Box>
                <Heading size="md" mb={2} color="teal.700">
                  <FaRobot style={{ display: 'inline', marginRight: '8px' }} />
                  Generar Rutina con IA
                </Heading>
                <Text color="gray.600">
                  Deja que nuestra IA cree una rutina personalizada basada en tus objetivos y nivel
                </Text>
              </Box>
              <Button
                leftIcon={<FaRobot />}
                colorScheme="teal"
                onClick={onOpen}
                size="lg"
              >
                Generar con IA
              </Button>
            </Flex>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isRequired mb={4}>
              <FormLabel>Nombre de la Rutina</FormLabel>
              <Input
                {...register('nombre', { required: 'El nombre es requerido' })}
                placeholder="Ej: Rutina Full Body"
              />
              {errors.nombre && <Box color="red.500" fontSize="sm" mt={1}>{errors.nombre.message}</Box>}
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                {...register('descripcion', { required: 'La descripción es requerida' })}
                placeholder="Describe tu rutina..."
                rows={4}
              />
              {errors.descripcion && <Box color="red.500" fontSize="sm" mt={1}>{errors.descripcion.message}</Box>}
            </FormControl>

            <FormControl isRequired mb={6}>
              <FormLabel>Nivel de Dificultad</FormLabel>
              <Select {...register('dificultad', { required: 'La dificultad es requerida' })}>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </Select>
              {errors.dificultad && <Box color="red.500" fontSize="sm" mt={1}>{errors.dificultad.message}</Box>}
            </FormControl>

            <Flex gap={4} justify="flex-end">
              <Button as={Link} to={isEditing ? `/rutinas/${id}` : '/rutinas'} variant="ghost">
                Cancelar
              </Button>
              <Button colorScheme="blue" type="submit">
                {isEditing ? 'Guardar Cambios' : 'Crear Rutina'}
              </Button>
            </Flex>
          </form>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center" gap={2}>
              <FaRobot />
              Generar Rutina con IA
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {aiError && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {aiError}
              </Alert>
            )}

            <FormControl mb={4}>
              <FormLabel>Objetivo de la Rutina</FormLabel>
              <Textarea
                placeholder="Ej: Ganar fuerza, perder peso, mejorar flexibilidad, aumentar masa muscular..."
                value={aiParams.objetivo}
                onChange={(e) => setAiParams({ ...aiParams, objetivo: e.target.value })}
                rows={3}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Nivel de Dificultad</FormLabel>
              <Select
                value={aiParams.dificultad}
                onChange={(e) => setAiParams({ ...aiParams, dificultad: e.target.value as any })}
              >
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </Select>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Duración (minutos)</FormLabel>
              <NumberInput
                value={aiParams.duracion}
                onChange={(_, value) => setAiParams({ ...aiParams, duracion: value || 45 })}
                min={15}
                max={120}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <Flex gap={4} justify="flex-end" mt={6}>
              <Button variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="teal"
                onClick={handleGenerarConIA}
                leftIcon={isGenerating ? <Spinner size="sm" /> : <FaRobot />}
                isLoading={isGenerating}
                loadingText="Generando..."
              >
                Generar Rutina
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

