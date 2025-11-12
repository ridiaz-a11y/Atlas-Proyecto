import { Box, Heading, Card, CardBody, FormControl, FormLabel, Input, Button, Flex, Text, Select, Avatar, VStack, HStack, useToast, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useAuthStore, User } from '../store/authStore'
import { useState, useRef } from 'react'
import { FaUser, FaSave } from 'react-icons/fa'

interface PerfilFormData {
  nombre: string
  nombreUsuario: string
  email: string
  sexo: 'masculino' | 'femenino' | 'otro'
  fechaNacimiento: string
  peso: number
  talla: number
  objetivo: string
  nivelActividad: 'sedentario' | 'ligero' | 'moderado' | 'intenso' | 'muy_intenso'
}

export default function Perfil() {
  const { user, updateUser } = useAuthStore()
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(user?.fotoPerfil || null)

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PerfilFormData>({
    defaultValues: user ? {
      nombre: user.nombre,
      nombreUsuario: user.nombreUsuario || user.nombre,
      email: user.email,
      sexo: user.sexo || 'masculino',
      fechaNacimiento: user.fechaNacimiento ? user.fechaNacimiento.split('T')[0] : '',
      peso: user.peso || 0,
      talla: user.talla || 0,
      objetivo: user.objetivo || '',
      nivelActividad: user.nivelActividad || 'moderado'
    } : undefined
  })

  const calcularEdad = (fechaNacimiento: string): number | undefined => {
    if (!fechaNacimiento) return undefined
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }
    return edad
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Crear URL local para preview
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setFotoPreview(result)
        // En producción, aquí subirías la imagen a un servidor
        // Por ahora, guardamos la URL local
        updateUser({ fotoPerfil: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = (data: PerfilFormData) => {
    const edad = data.fechaNacimiento ? calcularEdad(data.fechaNacimiento) : undefined
    
    const userData: Partial<User> = {
      nombre: data.nombre,
      nombreUsuario: data.nombreUsuario,
      email: data.email,
      sexo: data.sexo,
      fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento).toISOString() : undefined,
      peso: data.peso || undefined,
      talla: data.talla || undefined,
      edad,
      objetivo: data.objetivo || undefined,
      nivelActividad: data.nivelActividad,
      fotoPerfil: fotoPreview || undefined
    }

    updateUser(userData)
    
    toast({
      title: 'Perfil actualizado',
      description: 'Tu perfil se ha actualizado correctamente.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  if (!user) {
    return (
      <Box textAlign="center" py={12}>
        <Heading mb={4}>No hay usuario autenticado</Heading>
      </Box>
    )
  }

  const calcularIMC = () => {
    if (user.peso && user.talla) {
      const alturaEnMetros = user.talla / 100
      const imc = user.peso / (alturaEnMetros * alturaEnMetros)
      return imc.toFixed(1)
    }
    return null
  }

  const imc = calcularIMC()

  return (
    <Box>
      <Heading size="xl" mb={6} color="gray.700">Mi Perfil</Heading>

      <Card mb={6} bg="white" boxShadow="md">
        <CardBody>
          <VStack spacing={6}>
            {/* Foto de perfil */}
            <VStack spacing={4}>
              <Avatar
                size="xl"
                src={fotoPreview || undefined}
                name={user.nombre}
                bg="blue.500"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <Button
                size="sm"
                leftIcon={<FaUser />}
                onClick={() => fileInputRef.current?.click()}
              >
                Cambiar Foto
              </Button>
            </VStack>

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel color="gray.700" fontWeight="semibold">Nombre Completo</FormLabel>
                  <Input
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182CE" }}
                    {...register('nombre', { required: 'El nombre es requerido' })}
                    placeholder="Tu nombre completo"
                  />
                  {errors.nombre && <Text color="red.500" fontSize="sm" mt={1}>{errors.nombre.message}</Text>}
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.700" fontWeight="semibold">Nombre de Usuario</FormLabel>
                  <Input
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182CE" }}
                    {...register('nombreUsuario', { 
                      required: 'El nombre de usuario es requerido',
                      minLength: {
                        value: 3,
                        message: 'El nombre de usuario debe tener al menos 3 caracteres'
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message: 'Solo se permiten letras, números y guiones bajos'
                      }
                    })}
                    placeholder="nombre_usuario"
                  />
                  {errors.nombreUsuario && <Text color="red.500" fontSize="sm" mt={1}>{errors.nombreUsuario.message}</Text>}
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.700" fontWeight="semibold">Email</FormLabel>
                  <Input
                    type="email"
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182CE" }}
                    {...register('email', { 
                      required: 'El email es requerido',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    })}
                    placeholder="tu@email.com"
                  />
                  {errors.email && <Text color="red.500" fontSize="sm" mt={1}>{errors.email.message}</Text>}
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.700" fontWeight="semibold">Sexo</FormLabel>
                  <Select 
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182CE" }}
                    {...register('sexo', { required: 'El sexo es requerido' })}
                  >
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.700" fontWeight="semibold">Fecha de Nacimiento</FormLabel>
                  <Input
                    type="date"
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182CE" }}
                    {...register('fechaNacimiento')}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {user.edad && (
                    <Text fontSize="sm" color="gray.600" mt={1}>
                      Edad: {user.edad} años
                    </Text>
                  )}
                </FormControl>

                <HStack spacing={4}>
                  <FormControl>
                    <FormLabel color="gray.700" fontWeight="semibold">Peso (kg)</FormLabel>
                    <NumberInput
                      value={watch('peso') || 0}
                      onChange={(_, value) => setValue('peso', value || 0)}
                      min={0}
                      max={300}
                    >
                      <NumberInputField 
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182CE" }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="gray.700" fontWeight="semibold">Talla (cm)</FormLabel>
                    <NumberInput
                      value={watch('talla') || 0}
                      onChange={(_, value) => setValue('talla', value || 0)}
                      min={0}
                      max={250}
                    >
                      <NumberInputField 
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182CE" }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </HStack>

                {imc && (
                  <Box p={3} bg="blue.50" borderRadius="md">
                    <Text fontSize="sm" fontWeight="semibold" color="blue.700">
                      IMC: {imc} {imc && (
                        <Text as="span" fontSize="xs" color="gray.600">
                          ({imc < 18.5 ? 'Bajo peso' : imc < 25 ? 'Normal' : imc < 30 ? 'Sobrepeso' : 'Obesidad'})
                        </Text>
                      )}
                    </Text>
                  </Box>
                )}

                <FormControl>
                  <FormLabel color="gray.700" fontWeight="semibold">Objetivo</FormLabel>
                  <Input
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182CE" }}
                    {...register('objetivo')}
                    placeholder="Ej: Ganar masa muscular, perder peso, mejorar resistencia..."
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.700" fontWeight="semibold">Nivel de Actividad</FormLabel>
                  <Select 
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182CE" }}
                    {...register('nivelActividad')}
                  >
                    <option value="sedentario">Sedentario (poco o nada de ejercicio)</option>
                    <option value="ligero">Ligero (ejercicio ligero 1-3 días/semana)</option>
                    <option value="moderado">Moderado (ejercicio moderado 3-5 días/semana)</option>
                    <option value="intenso">Intenso (ejercicio intenso 6-7 días/semana)</option>
                    <option value="muy_intenso">Muy Intenso (ejercicio muy intenso, trabajo físico)</option>
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  leftIcon={<FaSave />}
                  width="100%"
                >
                  Guardar Cambios
                </Button>
              </VStack>
            </form>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  )
}

