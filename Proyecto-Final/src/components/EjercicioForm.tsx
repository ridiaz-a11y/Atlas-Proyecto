import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useRutinaStore } from '../store/rutinaStore'

interface EjercicioFormProps {
  isOpen: boolean
  onClose: () => void
  rutinaId: string
}

interface EjercicioFormData {
  nombre: string
  descripcion: string
  series: number
  repeticiones: number
  descanso: number
  categoria: 'fuerza' | 'cardio' | 'flexibilidad' | 'resistencias'
}

export default function EjercicioForm({ isOpen, onClose, rutinaId }: EjercicioFormProps) {
  const { addEjercicioToRutina } = useRutinaStore()
  const { register, handleSubmit, reset } = useForm<EjercicioFormData>()

  const onSubmit = (data: EjercicioFormData) => {
    addEjercicioToRutina(rutinaId, data)
    reset()
    onClose()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Agregar Ejercicio</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired mb={4}>
              <FormLabel>Nombre del Ejercicio</FormLabel>
              <Input {...register('nombre', { required: true })} placeholder="Ej: Sentadillas" />
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Descripción</FormLabel>
              <Textarea {...register('descripcion', { required: true })} placeholder="Describe el ejercicio" />
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Categoría</FormLabel>
              <Select {...register('categoria', { required: true })}>
                <option value="fuerza">Fuerza</option>
                <option value="cardio">Cardio</option>
                <option value="flexibilidad">Flexibilidad</option>
                <option value="resistencias">Resistencias</option>
              </Select>
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Series</FormLabel>
              <NumberInput min={1} max={10} defaultValue={3}>
                <NumberInputField {...register('series', { required: true, valueAsNumber: true })} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Repeticiones</FormLabel>
              <NumberInput min={1} max={100} defaultValue={10}>
                <NumberInputField {...register('repeticiones', { required: true, valueAsNumber: true })} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Descanso (segundos)</FormLabel>
              <NumberInput min={0} max={300} defaultValue={60}>
                <NumberInputField {...register('descanso', { required: true, valueAsNumber: true })} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" type="submit">
              Agregar Ejercicio
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

