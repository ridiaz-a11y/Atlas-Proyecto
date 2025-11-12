import { Box, Flex, Link, Heading, Container, Button, Text, Avatar, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { FaDumbbell, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { useAuthStore } from '../store/authStore'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="blue.600" color="white" py={4} mb={8}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Link as={RouterLink} to={user ? "/dashboard" : "/"} style={{ textDecoration: 'none' }}>
              <Flex 
                align="center" 
                gap={2} 
                cursor="pointer" 
                _hover={{ opacity: 0.8, transform: 'scale(1.05)' }}
                transition="all 0.2s ease-in-out"
              >
                <FaDumbbell size={24} />
                <Heading size="lg">Atlas Fitness</Heading>
              </Flex>
            </Link>
            <Flex gap={6} align="center">
              <Link 
                as={RouterLink} 
                to="/dashboard" 
                color="white" 
                _hover={{ color: 'gray.200', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                Inicio
              </Link>
              <Link 
                as={RouterLink} 
                to="/rutinas" 
                color="white" 
                _hover={{ color: 'gray.200', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                Mis Rutinas
              </Link>
              <Link 
                as={RouterLink} 
                to="/rutinas/nueva" 
                color="white" 
                _hover={{ color: 'gray.200', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                Nueva Rutina
              </Link>
              <Link 
                as={RouterLink} 
                to="/historial" 
                color="white" 
                _hover={{ color: 'gray.200', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                Historial
              </Link>
              {user && (
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="ghost"
                    colorScheme="whiteAlpha"
                    leftIcon={
                      <Avatar
                        size="sm"
                        src={user.fotoPerfil}
                        name={user.nombre}
                        bg="blue.400"
                      />
                    }
                  >
                    <Text fontSize="sm" color="white">
                      {user.nombreUsuario || user.nombre}
                    </Text>
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={RouterLink} to="/perfil" icon={<FaUser />} color="black">
                      Mi Perfil
                    </MenuItem>
                    <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout} color="black">
                      Cerrar Sesión
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
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

