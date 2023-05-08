import { createWallets } from '@/utils/wallet';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import React from 'react';

interface WalletProps {

}

interface WalletModalProps {
    isOpen: any,
    onClose: any,
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {

    const supabase = useSupabaseClient()

    const user = useUser()

    const handleWalletCreate = () => {
        const wallets = createWallets()
        storeWallets(wallets?.address, wallets?.private_key)
    }

    const storeWallets = async (public_key: string, private_key: string) => {

        const { data, error } = await supabase
            .from('wallets')
            .insert([
                { username: user?.user_metadata?.name, public_key, private_key },
            ])

        if (data) {
            return data
        }

        console.log(error)

    }
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bgColor="gray.900" borderTopLeftRadius="2xl" borderTopRightRadius="2xl">
                    <ModalHeader bgColor="black" border="1px solid" borderColor="gray.700" borderTopLeftRadius="2xl" borderTopRightRadius="2xl">Create Wallet</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text as="b" fontSize="xs">
                            These wallets should be used for degen and only degen purposes. On everything, if you put a freaking BAYC in one of these wallets you are being a goofy. Please just use these wallets to degen in shitcoins. Love you
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='black' variant='ghost' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant="outline" onClick={() => {
                            handleWalletCreate()
                            onClose()
                        }}>Create</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}


export default WalletModal;