import { useGasPrice } from '@/hooks/useGasPrice';
import { useGetMintWalletInfo } from '@/hooks/useGetMintWalletInfo';
import { realTx } from '@/utils/buy';
import {
    Button, HStack,
    Heading, Input,
    Text,
    VStack,
    useToast
} from '@chakra-ui/react';
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState } from 'react';
import { useForm } from "react-hook-form";

interface BuyingProps {

}

const Buying: React.FC<BuyingProps> = ({ }) => {
    const toast = useToast()
    const user = useUser()
    const supabase = useSupabaseClient()
    const [gasSelect, setGasSelect] = useState<any>(null)

    const { data: walletInfo } = useGetMintWalletInfo(user?.user_metadata?.name)
    const { data: gas } = useGasPrice()

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const handleRealTx = async (token: any, gwei: any, amount: any, public_key: any, private_key: any) => {
        realTx(token, gwei, amount, public_key, private_key).then(async (response) => {

            const { data, error } = await supabase
                .from('transactions')
                .insert([
                    { username: user?.user_metadata?.name, hash: response },
                ]).select()

            toast({
                title: 'Transaction Submitted.',
                description: "Check Transactions for status",
                status: "info",
                duration: 9000,
                isClosable: true,
            })

        }).catch((error) => {
            toast({
                title: 'Transaction Failed.',
                description: error,
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        })
    }

    const onSubmit = (data: any) => {
        console.log(data, gasSelect)
        handleRealTx(data?.token, String(gasSelect), data?.amount, walletInfo?.public_key, walletInfo?.private_key)
    }
    const handleGas = (gas: any) => {
        console.log(gas)
        setGasSelect(gas)
    }

    return (
        <VStack w="100%" pt="2rem">
            <Heading>Shitcoin Bot</Heading>
            <Text textAlign="center">Seamlessly front run others into shitcoins with the quickness. Please use a burner wallet and not your actual wallet.</Text>
            <form onSubmit={handleSubmit(onSubmit)} style={{
                width: "100%"
            }}>
                <VStack gap="0.5rem" w="full">
                    <Input placeholder="token address" {...register("token", { required: true })} />
                    <HStack w="100%">
                        <Input
                            value={gasSelect || ""}
                            placeholder="gwei"
                            // {...register("gwei", { required: true })}
                            onChange={(event) => setGasSelect(event.target.value)}
                        />
                        <Button variant="outline" onClick={() => handleGas(gas?.data?.[4]?.attributes?.info?.slow / 1000000000)}>
                            🐢 {gas?.data?.[4]?.attributes?.info?.slow / 1000000000}
                        </Button>
                        <Button variant="outline" onClick={() => handleGas(gas?.data?.[4]?.attributes?.info?.standard / 1000000000)}>
                            🚗 {gas?.data?.[4]?.attributes?.info?.standard / 1000000000}
                        </Button>
                        <Button variant="outline" onClick={() => handleGas(gas?.data?.[4]?.attributes?.info?.fast / 1000000000)}>
                            🚀 {gas?.data?.[4]?.attributes?.info?.fast / 1000000000}
                        </Button>
                    </HStack>
                    <Input placeholder="ETH Amount" {...register("amount", { required: true })} />
                    <Input defaultValue={walletInfo?.public_key} disabled />
                    <HStack pt="1rem" justify="center">
                        <Button type="submit" variant="outline">
                            Gen Wealth
                        </Button>
                    </HStack>
                </VStack>
            </form>
        </VStack>
    );
}

export default Buying;