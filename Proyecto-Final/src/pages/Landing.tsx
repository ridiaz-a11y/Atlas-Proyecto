import { Box, Heading, Text, Button, Flex, Container, SimpleGrid, Card, CardBody, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { FaDumbbell, FaRobot, FaChartLine, FaUsers } from 'react-icons/fa'

export default function Landing() {
  return (
    <Box minH="100vh" bg="gray.50">
      {/* Hero Section */}
      <Box bg="blue.600" color="white" py={20}>
        <Container maxW="container.xl">
          <Flex direction="column" align="center" textAlign="center">
            <FaDumbbell size={64} style={{ marginBottom: '24px' }} />
            <Heading size="2xl" mb={4}>
              Atlas Fitness
            </Heading>
            <Text fontSize="xl" mb={8} maxW="600px">
              Gestiona tus rutinas de ejercicios de manera fácil y eficiente. 
              Crea rutinas personalizadas o deja que nuestra IA las genere por ti.
            </Text>
            <Flex gap={4}>
              <Button as={Link} to="/login" colorScheme="whiteAlpha" size="lg" variant="outline">
                Iniciar Sesión
              </Button>
              <Button as={Link} to="/register" colorScheme="whiteAlpha" size="lg">
                Registrarse
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.xl" py={16}>
        <Heading textAlign="center" mb={12} size="xl">
          Características Principales
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          <Card>
            <CardBody>
              <VStack spacing={4}>
                <Box p={4} borderRadius="full" bg="blue.100" color="blue.600">
                  <FaDumbbell size={32} />
                </Box>
                <Heading size="md">Rutinas Personalizadas</Heading>
                <Text textAlign="center" color="gray.600">
                  Crea y gestiona tus propias rutinas de ejercicios adaptadas a tus necesidades
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={4}>
                <Box p={4} borderRadius="full" bg="teal.100" color="teal.600">
                  <FaRobot size={32} />
                </Box>
                <Heading size="md">Generación con IA</Heading>
                <Text textAlign="center" color="gray.600">
                  Deja que nuestra inteligencia artificial cree rutinas personalizadas para ti
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={4}>
                <Box p={4} borderRadius="full" bg="purple.100" color="purple.600">
                  <FaChartLine size={32} />
                </Box>
                <Heading size="md">Seguimiento de Progreso</Heading>
                <Text textAlign="center" color="gray.600">
                  Mantén un historial completo de todas tus actividades y progreso
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={4}>
                <Box p={4} borderRadius="full" bg="green.100" color="green.600">
                  <FaUsers size={32} />
                </Box>
                <Heading size="md">Fácil de Usar</Heading>
                <Text textAlign="center" color="gray.600">
                  Interfaz intuitiva diseñada para que puedas enfocarte en tu entrenamiento
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Container>

      {/* CTA Section */}
      <Box bg="blue.50" py={16}>
        <Container maxW="container.xl">
          <Flex direction="column" align="center" textAlign="center">
            <Heading size="xl" mb={4}>
              ¿Listo para comenzar?
            </Heading>
            <Text fontSize="lg" color="gray.600" mb={8} maxW="600px">
              Únete a Atlas Fitness hoy y comienza a alcanzar tus objetivos de fitness
            </Text>
            <Button as={Link} to="/register" colorScheme="blue" size="lg">
              Crear Cuenta Gratis
            </Button>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}

