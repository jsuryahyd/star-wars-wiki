import { type ReactNode } from "react"
import { Box, Flex, Heading, IconButton, Spacer, Text } from "@chakra-ui/react"
import { FaRegHeart, FaStar, FaMoon, FaSun } from "react-icons/fa"
import { Link } from "@tanstack/react-router"
import { useColorMode } from "../ui/color-mode"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Flex direction="column" minH="100vh">
      <Box as="header"  py={4} px={6} boxShadow="sm">
        <Flex align="center" maxW="6xl" mx="auto">
          <Spacer display={{ base: "none", md: "flex" }}/>
						<Link to={import.meta.env.BASE_URL} style={{ textDecoration: "none", color: "inherit" }}>
							<Heading
								as="h1"
								size="2xl"
								textAlign="center"
								flex="1"
							>
								Star Wars Wiki
							</Heading>
						</Link>
          <Spacer />
          <Link to={import.meta.env.BASE_URL + "favourites"}>
            <IconButton
              aria-label="Favourites"
              variant="ghost"
              colorScheme="yellow"
              fontSize="xl"
              ml={2}
            ><FaRegHeart /></IconButton>
          </Link>
          <IconButton
            aria-label="Toggle color mode"
            onClick={toggleColorMode}
            variant="ghost"
            colorScheme="blue"
            fontSize="xl"
            ml={2}
          >{colorMode === "light" ? <FaMoon /> : <FaSun />}</IconButton>
        </Flex>
      </Box>

      
      <Box as="main" flex="1" py={8} px={4} maxW="6xl" mx="auto" w="100%">
        {children}
      </Box>


      <Box as="footer" bg="gray.900" color="gray.300" py={3} textAlign="center">
        <Text fontSize="sm">&copy; {new Date().getFullYear()} Jaya Surya</Text>
      </Box>
    </Flex>
  )
}