import { useGetWalletInfo } from '@/hooks/useGetWallets';
import { Box, Button, VStack, useDisclosure } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import WalletCard from './WalletCard';
import WalletModal from './WalletModal';

interface WalletProps {

}



const Wallet: React.FC<WalletProps> = ({ }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const user = useUser()
    const supabase = useSupabaseClient()

    const { data: wallets, refetch: walletsRefetch } = useGetWalletInfo(user?.user_metadata?.name)

    supabase.channel('wallets')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'wallets' },
            (payload) => {
                console.log('Change received!', payload)
                walletsRefetch()
            }
        )
        .subscribe()


    return (
        <VStack w="100%">
            <VStack w="100%">
                <VStack align="flex-end" w="100%">
                    <Button onClick={onOpen} variant="outline">Create</Button>
                </VStack>
                {wallets?.map((wallet: any, index: number) => {
                    return (
                        <Box key={index}>
                            <WalletCard mintWallet={wallet} />
                        </Box>
                    )
                })}
            </VStack>
            <WalletModal isOpen={isOpen} onClose={onClose} />
        </VStack>
    );
}

export default Wallet;