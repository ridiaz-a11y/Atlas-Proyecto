import { Box, Heading, VStack, Card, CardBody, Text, Badge, Flex, Divider } from '@chakra-ui/react'
import { useRutinaStore } from '../store/rutinaStore'
import { FaPlus, FaEdit, FaTrash, FaDumbbell, FaRobot } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Historial() {
  const { actividades } = useRutinaStore()

  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case 'rutina_creada':
        return <FaPlus color="#48BB78" />
      case 'rutina_editada':
        return <FaEdit color="#3182CE" />
      case 'rutina_eliminada':
        return <FaTrash color="#F56565" />
      case 'ejercicio_agregado':
        return <FaDumbbell color="#805AD5" />
      case 'ejercicio_eliminado':
        return <FaDumbbell color="#F56565" />
      case 'rutina_generada_ia':
        return <FaRobot color="#38B2AC" />
      default:
        return <FaDumbbell color="#718096" />
    }
  }

  const getActivityColor = (tipo: string) => {
    switch (tipo) {
      case 'rutina_creada':
        return 'green'
      case 'rutina_editada':
        return 'blue'
      case 'rutina_eliminada':
        return 'red'
      case 'ejercicio_agregado':
        return 'purple'
      case 'ejercicio_eliminado':
        return 'red'
      case 'rutina_generada_ia':
        return 'teal'
      default:
        return 'gray'
    }
  }

  const getActivityLabel = (tipo: string) => {
    switch (tipo) {
      case 'rutina_creada':
        return 'Rutina Creada'
      case 'rutina_editada':
        return 'Rutina Editada'
      case 'rutina_eliminada':
        return 'Rutina Eliminada'
      case 'ejercicio_agregado':
        return 'Ejercicio Agregado'
      case 'ejercicio_eliminado':
        return 'Ejercicio Eliminado'
      case 'rutina_generada_ia':
        return 'Generado con IA'
      default:
        return 'Actividad'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Hace unos momentos'
    if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`
    if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
    if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`
    
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const sortedActivities = [...actividades].sort((a, b) => 
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  )

  return (
    <Box>
      <Heading size="xl" mb={6}>Historial de Actividades</Heading>
      <Text mb={8} fontSize="lg" color="gray.600">
        Aquí puedes ver todo el proceso de lo que has hecho en Atlas Fitness
      </Text>

      {sortedActivities.length === 0 ? (
        <Card>
          <CardBody textAlign="center" py={12}>
            <Text fontSize="lg" color="gray.500" mb={4}>
              Aún no hay actividades registradas
            </Text>
            <Text fontSize="sm" color="gray.400">
              Comienza creando tu primera rutina para ver tu historial aquí
            </Text>
          </CardBody>
        </Card>
      ) : (
        <VStack spacing={4} align="stretch">
          {sortedActivities.map((actividad, index) => (
            <Card key={actividad.id} _hover={{ shadow: 'md' }}>
              <CardBody>
                <Flex align="start" gap={4}>
                  <Box
                    p={3}
                    borderRadius="full"
                    bg={`${getActivityColor(actividad.tipo)}.100`}
                    color={`${getActivityColor(actividad.tipo)}.600`}
                    fontSize="xl"
                  >
                    {getActivityIcon(actividad.tipo)}
                  </Box>
                  <Box flex={1}>
                    <Flex align="center" gap={2} mb={2}>
                      <Badge colorScheme={getActivityColor(actividad.tipo)}>
                        {getActivityLabel(actividad.tipo)}
                      </Badge>
                      <Text fontSize="sm" color="gray.500">
                        {formatDate(actividad.fecha)}
                      </Text>
                    </Flex>
                    <Text fontSize="md" mb={2}>
                      {actividad.descripcion}
                    </Text>
                    {actividad.rutinaId && actividad.rutinaNombre && (
                      <Text fontSize="sm" color="gray.600">
                        <Link 
                          to={`/rutinas/${actividad.rutinaId}`}
                          style={{ color: '#3182CE', textDecoration: 'underline' }}
                        >
                          Ver rutina: {actividad.rutinaNombre}
                        </Link>
                      </Text>
                    )}
                  </Box>
                </Flex>
              </CardBody>
              {index < sortedActivities.length - 1 && <Divider />}
            </Card>
          ))}
        </VStack>
      )}
    </Box>
  )
}

