import { Box, Heading, Card, CardBody, FormControl, FormLabel, Input, Textarea, Select, Button, Flex } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useRutinaStore } from '../store/rutinaStore'
import { RutinaFormData } from '../types'
import { FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function RutinaForm() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const { rutinas, addRutina, updateRutina } = useRutinaStore()
  const isEditing = !!id
  const rutina = isEditing ? rutinas.find((r) => r.id === id) : null

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
    </Box>
  )
}

