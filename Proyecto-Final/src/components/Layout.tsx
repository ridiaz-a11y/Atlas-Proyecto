import { Box, Flex, Link, Heading, Container } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaDumbbell } from 'react-icons/fa'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="blue.600" color="white" py={4} mb={8}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={2}>
              <FaDumbbell size={24} />
              <Heading size="lg">Atlas Fitness</Heading>
            </Flex>
            <Flex gap={6}>
              <Link as={RouterLink} to="/" color="white" _hover={{ color: 'gray.200' }}>
                Inicio
              </Link>
              <Link as={RouterLink} to="/rutinas" color="white" _hover={{ color: 'gray.200' }}>
                Mis Rutinas
              </Link>
              <Link as={RouterLink} to="/rutinas/nueva" color="white" _hover={{ color: 'gray.200' }}>
                Nueva Rutina
              </Link>
              <Link as={RouterLink} to="/historial" color="white" _hover={{ color: 'gray.200' }}>
                Historial
              </Link>
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Container maxW="container.xl" pb={8}>
        {children}
      </Container>
    </Box>
  )
}

