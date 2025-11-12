import { Box, Heading, Text, Card, CardBody, Badge, Button, SimpleGrid, Flex, IconButton, useDisclosure, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from '@chakra-ui/react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FaTrash, FaEdit, FaPlus, FaArrowLeft, FaPlay } from 'react-icons/fa'
import { useRutinaStore } from '../store/rutinaStore'
import { useRef } from 'react'
import EjercicioCard from '../components/EjercicioCard'
import EjercicioForm from '../components/EjercicioForm'

export default function RutinaDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { rutinas, deleteRutina, deleteEjercicioFromRutina } = useRutinaStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure()

  const rutina = rutinas.find((r) => r.id === id)

  if (!rutina) {
    return (
      <Box textAlign="center" py={12}>
        <Heading mb={4}>Rutina no encontrada</Heading>
        <Button as={Link} to="/rutinas">Volver a Rutinas</Button>
      </Box>
    )
  }

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

  const handleDelete = () => {
    deleteRutina(rutina.id)
    navigate('/rutinas')
  }

  const totalDuracion = rutina.ejercicios.reduce((acc, ej) => {
    return acc + (ej.series * (ej.descanso / 60)) + (ej.series * 2) // tiempo estimado por serie
  }, 0)

  return (
    <Box>
      <Flex align="center" gap={4} mb={6}>
        <Button as={Link} to="/rutinas" leftIcon={<FaArrowLeft />} variant="ghost">
          Volver
        </Button>
        <Heading flex={1} size="xl">{rutina.nombre}</Heading>
        <Button leftIcon={<FaEdit />} onClick={() => navigate(`/rutinas/${rutina.id}/editar`)}>
          Editar
        </Button>
        <IconButton
          aria-label="Eliminar rutina"
          icon={<FaTrash />}
          colorScheme="red"
          onClick={onOpen}
        />
      </Flex>

      <Card mb={6}>
        <CardBody>
          <Text mb={4} color="gray.600">{rutina.descripcion}</Text>
          <Flex gap={2} wrap="wrap">
            <Badge colorScheme={getDifficultyColor(rutina.dificultad)} fontSize="md" p={2}>
              {rutina.dificultad}
            </Badge>
            <Badge colorScheme="blue" fontSize="md" p={2}>
              {rutina.ejercicios.length} ejercicios
            </Badge>
            <Badge colorScheme="purple" fontSize="md" p={2}>
              ~{Math.round(totalDuracion)} min estimados
            </Badge>
          </Flex>
        </CardBody>
      </Card>

      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg">Ejercicios</Heading>
        <Flex gap={2}>
          {rutina.ejercicios.length > 0 && (
            <Button 
              as={Link} 
              to={`/rutinas/${rutina.id}/ejecutar`} 
              leftIcon={<FaPlay />} 
              colorScheme="blue"
            >
              Iniciar con Voz
            </Button>
          )}
          <Button leftIcon={<FaPlus />} colorScheme="green" onClick={onFormOpen}>
            Agregar Ejercicio
          </Button>
        </Flex>
      </Flex>

      {rutina.ejercicios.length === 0 ? (
        <Card>
          <CardBody textAlign="center" py={12}>
            <Text color="gray.500" mb={4}>No hay ejercicios en esta rutina</Text>
            <Button leftIcon={<FaPlus />} colorScheme="green" onClick={onFormOpen}>
              Agregar Primer Ejercicio
            </Button>
          </CardBody>
        </Card>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {rutina.ejercicios.map((ejercicio) => (
            <EjercicioCard
              key={ejercicio.id}
              ejercicio={ejercicio}
              onDelete={() => deleteEjercicioFromRutina(rutina.id, ejercicio.id)}
            />
          ))}
        </SimpleGrid>
      )}

      <EjercicioForm
        isOpen={isFormOpen}
        onClose={onFormClose}
        rutinaId={rutina.id}
      />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Rutina
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de que quieres eliminar la rutina "{rutina.nombre}"? Esta acción no se puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}

