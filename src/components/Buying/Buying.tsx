import { useGetMintWalletInfo } from '@/hooks/useGetMintWalletInfo';
import { realTx } from '@/utils/swap';
import {
    Button, HStack,
    Heading, Input,
    Select,
    Text,
    VStack,
    useToast
} from '@chakra-ui/react';
import { useUser } from "@supabase/auth-helpers-react";
import { useForm } from "react-hook-form";

interface BuyingProps {

}

const Buying: React.FC<BuyingProps> = ({ }) => {
    const toast = useToast()
    const user = useUser()


    const { data: walletInfo } = useGetMintWalletInfo(user?.user_metadata?.name)

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const handleRealTx = async (token: any, gwei: any, amount: any, public_key: any, private_key: any) => {
        try {
            const info = await realTx(token, gwei, amount, public_key, private_key)
        } catch (err) {
            console.log("Buy Error", err);
        }
    }
    const onSubmit = (data: any) => {
        console.log(data)
        handleRealTx(data?.token, data?.gwei, data?.amount, walletInfo?.public_key, walletInfo?.private_key)
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
                    <Input placeholder="gwei" {...register("gwei", { required: true })} />
                    <Input placeholder="ETH Amount" {...register("amount", { required: true })} />
                    <Input defaultValue={walletInfo?.public_key} disabled />
                    <HStack pt="1rem" justify="center">
                        <Button type="submit" variant="outline">Lose Money</Button>
                    </HStack>
                </VStack>
            </form>
        </VStack>
    );
}

export default Buying;