import { Card, CardBody, Heading, Text, Badge, Flex, IconButton, Box } from '@chakra-ui/react'
import { FaTrash } from 'react-icons/fa'
import { Ejercicio } from '../types'

interface EjercicioCardProps {
  ejercicio: Ejercicio
  onDelete: () => void
}

export default function EjercicioCard({ ejercicio, onDelete }: EjercicioCardProps) {
  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'fuerza':
        return 'red'
      case 'cardio':
        return 'orange'
      case 'flexibilidad':
        return 'blue'
      case 'resistencias':
        return 'purple'
      default:
        return 'gray'
    }
  }

  return (
    <Card>
      <CardBody>
        <Flex justify="space-between" align="start">
          <Box flex={1}>
            <Heading size="sm" mb={2}>{ejercicio.nombre}</Heading>
            <Text fontSize="sm" color="gray.600" mb={3}>
              {ejercicio.descripcion}
            </Text>
            <Flex gap={2} mb={2} wrap="wrap">
              <Badge colorScheme={getCategoryColor(ejercicio.categoria)}>
                {ejercicio.categoria}
              </Badge>
              <Badge colorScheme="blue">
                {ejercicio.series} series
              </Badge>
              <Badge colorScheme="green">
                {ejercicio.repeticiones} repeticiones
              </Badge>
              <Badge colorScheme="gray">
                {ejercicio.descanso}s descanso
              </Badge>
            </Flex>
          </Box>
          <IconButton
            aria-label="Eliminar ejercicio"
            icon={<FaTrash />}
            size="sm"
            colorScheme="red"
            onClick={onDelete}
          />
        </Flex>
      </CardBody>
    </Card>
  )
}

