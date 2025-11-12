import { Box, Heading, Card, CardBody, FormControl, FormLabel, Input, Button, Flex, Text, Link, Alert, AlertIcon, Select } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useState } from 'react'
import { FaDumbbell } from 'react-icons/fa'

interface RegisterFormData {
  nombre: string
  nombreUsuario: string
  email: string
  password: string
  confirmPassword: string
  sexo: 'masculino' | 'femenino' | 'otro'
}

export default function Register() {
  const navigate = useNavigate()
  const register = useAuthStore((state) => state.register)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { register: registerField, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>()

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    setError(null)

    if (data.password !== data.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setIsLoading(true)
    
    try {
      const success = await register(data.email, data.password, data.nombre, data.nombreUsuario, data.sexo)
      if (success) {
        navigate('/dashboard')
      } else {
        setError('Error al crear la cuenta. Por favor intenta de nuevo.')
      }
    } catch (err) {
      setError('Error al registrarse. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center" py={12}>
      <Box w="100%" maxW="md">
        <Flex direction="column" align="center" mb={8}>
          <FaDumbbell size={48} color="#3182CE" />
          <Heading size="xl" mt={4} mb={2}>
            Atlas Fitness
          </Heading>
          <Text color="gray.600">Crea tu cuenta gratuita</Text>
        </Flex>

        <Card>
          <CardBody>
            {error && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isRequired mb={4}>
                <FormLabel>Nombre Completo</FormLabel>
                <Input
                  {...registerField('nombre', { required: 'El nombre es requerido' })}
                  placeholder="Tu nombre completo"
                />
                {errors.nombre && <Text color="red.500" fontSize="sm" mt={1}>{errors.nombre.message}</Text>}
              </FormControl>

              <FormControl isRequired mb={4}>
                <FormLabel>Nombre de Usuario</FormLabel>
                <Input
                  {...registerField('nombreUsuario', { 
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

              <FormControl isRequired mb={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  {...registerField('email', { 
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

              <FormControl isRequired mb={4}>
                <FormLabel>Sexo</FormLabel>
                <Select {...registerField('sexo', { required: 'El sexo es requerido' })}>
                  <option value="">Selecciona una opción</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </Select>
                {errors.sexo && <Text color="red.500" fontSize="sm" mt={1}>{errors.sexo.message}</Text>}
              </FormControl>

              <FormControl isRequired mb={4}>
                <FormLabel>Contraseña</FormLabel>
                <Input
                  type="password"
                  {...registerField('password', { 
                    required: 'La contraseña es requerida',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres'
                    }
                  })}
                  placeholder="••••••••"
                />
                {errors.password && <Text color="red.500" fontSize="sm" mt={1}>{errors.password.message}</Text>}
              </FormControl>

              <FormControl isRequired mb={6}>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <Input
                  type="password"
                  {...registerField('confirmPassword', { 
                    required: 'Confirma tu contraseña',
                    validate: (value) => value === password || 'Las contraseñas no coinciden'
                  })}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <Text color="red.500" fontSize="sm" mt={1}>{errors.confirmPassword.message}</Text>}
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                size="lg"
                isLoading={isLoading}
                loadingText="Creando cuenta..."
              >
                Crear Cuenta
              </Button>
            </form>

            <Flex justify="center" mt={6}>
              <Text color="gray.600">
                ¿Ya tienes una cuenta?{' '}
                <Link as={RouterLink} to="/login" color="blue.500" fontWeight="semibold">
                  Inicia sesión aquí
                </Link>
              </Text>
            </Flex>

            <Flex justify="center" mt={4}>
              <Link as={RouterLink} to="/" color="gray.500" fontSize="sm">
                ← Volver al inicio
              </Link>
            </Flex>
          </CardBody>
        </Card>
      </Box>
    </Box>
  )
}

