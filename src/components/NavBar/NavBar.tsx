import { useGasPrice } from '@/hooks/useGasPrice';
import { Avatar, Box, Button, HStack, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Text } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
interface NavBarProps { }

const NavBar: React.FC<NavBarProps> = ({ }) => {
    const supabase = useSupabaseClient()
    const user = useUser()


    const signInWithDiscord = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'discord',
            options: {
                redirectTo: process.env.NEXT_PUBLIC_URL
            }
        },)


        if (data) {
            return data
        }

        if (error) {
            throw error
        }
    }

    const signout = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) {
            console.log("Logout", error)
        }
    }

    const { data: gas } = useGasPrice()

    console.log("Gas", gas?.data?.[4])
    return (
        <HStack w="95%" p="1rem" justify="flex-end" gap="1rem">
            <HStack>
                {gas?.data?.[4]?.attributes?.info?.slow && <Text as="b">🐢 {gas?.data?.[4]?.attributes?.info?.slow / 1000000000}</Text>}
                {gas?.data?.[4]?.attributes?.info?.standard && <Text as="b">🚗 {gas?.data?.[4]?.attributes?.info?.standard / 1000000000}</Text>}
                {gas?.data?.[4]?.attributes?.info?.fast && <Text as="b">🚀 {gas?.data?.[4]?.attributes?.info?.fast / 1000000000}</Text>}
            </HStack>
            {user ?
                <Box>
                    <Popover>
                        <PopoverTrigger>
                            <Button variant="outline">
                                <HStack>
                                    <Avatar size="xs" src={user?.user_metadata?.avatar_url} />
                                    <Text>{user?.user_metadata?.name}</Text>
                                </HStack>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverBody>
                                <Button onClick={signout} variant="solid">Logout</Button>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </Box>
                : <Button onClick={signInWithDiscord} variant="outline">
                    Login Discord
                </Button>

            }
        </HStack >
    );
}

export default NavBar;