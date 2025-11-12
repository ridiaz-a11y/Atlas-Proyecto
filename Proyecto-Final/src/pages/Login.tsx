import { Box, Heading, Card, CardBody, FormControl, FormLabel, Input, Button, Flex, Text, Link, Alert, AlertIcon } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useState } from 'react'
import { FaDumbbell } from 'react-icons/fa'

interface LoginFormData {
  email: string
  password: string
}

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    setIsLoading(true)
    
    try {
      const success = await login(data.email, data.password)
      if (success) {
        navigate('/dashboard')
      } else {
        setError('Email o contraseña incorrectos')
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor intenta de nuevo.')
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
          <Text color="gray.600">Inicia sesión en tu cuenta</Text>
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
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  {...register('email', { 
                    required: 'El email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  placeholder="rolinpinPCD@email.com"
                />
                {errors.email && <Text color="red.500" fontSize="sm" mt={1}>{errors.email.message}</Text>}
              </FormControl>

              <FormControl isRequired mb={6}>
                <FormLabel>Contraseña</FormLabel>
                <Input
                  type="password"
                  {...register('password', { required: 'La contraseña es requerida' })}
                  placeholder="••••••••"
                />
                {errors.password && <Text color="red.500" fontSize="sm" mt={1}>{errors.password.message}</Text>}
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                size="lg"
                isLoading={isLoading}
                loadingText="Iniciando sesión..."
              >
                Iniciar Sesión
              </Button>
            </form>

            <Flex justify="center" mt={6}>
              <Text color="gray.600">
                ¿No tienes una cuenta?{' '}
                <Link as={RouterLink} to="/register" color="blue.500" fontWeight="semibold">
                  Regístrate aquí
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

