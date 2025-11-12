import { Box, Heading, Button, SimpleGrid, Card, CardBody, Text, Badge, Flex, IconButton } from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa'
import { useRutinaStore } from '../store/rutinaStore'

export default function RutinasList() {
  const { rutinas, deleteRutina } = useRutinaStore()
  const navigate = useNavigate()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'principiante':
        return 'green'
      case 'intermedio':
        return 'yellow'
      case 'avanzado':
        return 'red'
      default:
        return 'gray'
    }
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="xl">Mis Rutinas</Heading>
        <Button as={Link} to="/rutinas/nueva" leftIcon={<FaPlus />} colorScheme="blue">
          Nueva Rutina
        </Button>
      </Flex>

      {rutinas.length === 0 ? (
        <Card>
          <CardBody textAlign="center" py={12}>
            <Text fontSize="lg" color="gray.500" mb={4}>
              No tienes rutinas creadas aún
            </Text>
            <Button as={Link} to="/rutinas/nueva" colorScheme="blue">
              Crear tu Primera Rutina
            </Button>
          </CardBody>
        </Card>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {rutinas.map((rutina, index) => (
            <Card 
              key={rutina.id} 
              _hover={{ 
                shadow: 'xl', 
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease-in-out'
              }}
              transition="all 0.3s ease-in-out"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              <CardBody>
                <Flex justify="space-between" align="start" mb={2}>
                  <Box flex={1}>
                    <Heading size="md" mb={2}>{rutina.nombre}</Heading>
                    <Text fontSize="sm" color="gray.600" mb={3}>
                      {rutina.descripcion}
                    </Text>
                  </Box>
                  <Flex gap={2}>
                    <IconButton
                      aria-label="Editar rutina"
                      icon={<FaEdit />}
                      size="sm"
                      onClick={() => navigate(`/rutinas/${rutina.id}/editar`)}
                    />
                    <IconButton
                      aria-label="Eliminar rutina"
                      icon={<FaTrash />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => deleteRutina(rutina.id)}
                    />
                  </Flex>
                </Flex>
                <Flex gap={2} mb={3} wrap="wrap">
                  <Badge colorScheme={getDifficultyColor(rutina.dificultad)}>
                    {rutina.dificultad}
                  </Badge>
                  <Badge colorScheme="blue">
                    {rutina.ejercicios.length} ejercicios
                  </Badge>
                  <Badge colorScheme="purple">
                    {rutina.duracion} min
                  </Badge>
                </Flex>
                <Button
                  as={Link}
                  to={`/rutinas/${rutina.id}`}
                  colorScheme="blue"
                  size="sm"
                  width="100%"
                >
                  Ver Detalles
                </Button>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  )
}

