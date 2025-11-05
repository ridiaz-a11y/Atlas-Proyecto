import { Box, Heading, Text, SimpleGrid, Card, CardBody, Button, Flex } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { FaPlus, FaList } from 'react-icons/fa'
import { useRutinaStore } from '../store/rutinaStore'

export default function Home() {
  const { rutinas } = useRutinaStore()

  return (
    <Box>
      <Heading mb={4} size="xl">Bienvenido a Atlas Fitness</Heading>
      <Text mb={8} fontSize="lg" color="gray.600">
        Gestiona tus rutinas de ejercicios de manera fácil y eficiente
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Flex direction="column" align="center" justify="center" py={8}>
              <FaList size={48} color="#3182CE" />
              <Heading size="md" mt={4} mb={2}>
                Mis Rutinas
              </Heading>
              <Text mb={4} color="gray.600" textAlign="center">
                Tienes {rutinas.length} {rutinas.length === 1 ? 'rutina' : 'rutinas'} creada{rutinas.length !== 1 ? 's' : ''}
              </Text>
              <Button as={Link} to="/rutinas" colorScheme="blue">
                Ver Todas
              </Button>
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Flex direction="column" align="center" justify="center" py={8}>
              <FaPlus size={48} color="#3182CE" />
              <Heading size="md" mt={4} mb={2}>
                Crear Nueva Rutina
              </Heading>
              <Text mb={4} color="gray.600" textAlign="center">
                Crea una rutina personalizada con tus ejercicios favoritos
              </Text>
              <Button as={Link} to="/rutinas/nueva" colorScheme="green">
                Crear Rutina
              </Button>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>

      {rutinas.length > 0 && (
        <Box>
          <Heading size="md" mb={4}>Rutinas Recientes</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {rutinas.slice(0, 3).map((rutina) => (
              <Card key={rutina.id} as={Link} to={`/rutinas/${rutina.id}`} _hover={{ shadow: 'lg' }}>
                <CardBody>
                  <Heading size="sm" mb={2}>{rutina.nombre}</Heading>
                  <Text fontSize="sm" color="gray.600" mb={2}>{rutina.descripcion}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {rutina.ejercicios.length} ejercicios • {rutina.duracion} min
                  </Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Box>
  )
}

