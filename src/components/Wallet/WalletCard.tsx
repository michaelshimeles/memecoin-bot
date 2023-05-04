import { useGetMintWalletInfo } from '@/hooks/useGetMintWalletInfo';
import { usePortfolio } from '@/hooks/usePortfolio';
import { getBalance } from '@/utils/balance';
import { sweep } from '@/utils/transfer';
import { Button, Select, Card, CardBody, CardFooter, HStack, Heading, Input, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Portal, Stack, Text, VStack, Box, Radio, RadioGroup } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface WalletCardProps {
    mintWallet: any
}

const WalletCard: React.FC<WalletCardProps> = ({ mintWallet }) => {

    const [wBalance, setwBalance] = useState<any>(null)
    const supabase = useSupabaseClient()
    const user = useUser()
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const { data: mainWallet, refetch } = useGetMintWalletInfo(user?.user_metadata?.name)
    const { data: portfolio } = usePortfolio(mainWallet?.public_key)


    const onSubmit = async (data: any) => {
        console.log("Data", data)
        console.log("Private", mainWallet?.private_key)
        console.log("address", data?.address)
        console.log("tokenAddress", portfolio?.data?.[1]?.attributes?.fungible_info.implementations[0].address)
        console.log("amount", "100")

        const privateKey = mainWallet?.private_key; // replace with your private key
        const newAddress = data?.address; // replace with the address you want to transfer the tokens to
        const tokenAddress = portfolio?.data?.[1]?.attributes?.fungible_info.implementations[0].address; // replace with the address of the ERC-20 token contract
        const amount = "100";

        try {
            const resp = await sweep(privateKey, newAddress, tokenAddress, amount)
            console.log("resp", resp)
        } catch (error) {
            console.log("Err", error)
        }
    };

    supabase.channel('wallet')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'wallet' },
            (payload) => {
                console.log('Change received!', payload)
                refetch()
            }
        )
        .subscribe()

    useEffect(() => {
        walletBalance(mintWallet?.public_key)
    }, [user])

    const walletBalance = async (wallet: string) => {
        try {
            const balance = await getBalance(wallet)
            setwBalance(balance)
        } catch (error) {
            console.log("error", error)
            return error
        }

    }


    const handleMakeActive = async () => {

        const { data, error } = await supabase
            .from('wallet')
            .update({ public_key: mintWallet?.public_key, private_key: mintWallet?.private_key })
            .eq('username', user?.user_metadata?.name);

        if (data) {
            return
        }

        if (error) {
            console.log("Active Wallet", error)
            return
        }

    }

    return (
        <VStack>
            {mainWallet?.public_key === mintWallet?.public_key ? <Card
                direction={{ base: 'column', sm: 'row' }}
                overflow='hidden'
                variant='outline'
                w="500px"
                bgColor="blackAlpha.900"
                border="1px solid"
                borderColor="white"
            >
                <Stack>
                    <CardBody>
                        <Heading size='sm'>{mintWallet?.public_key}</Heading>
                        <Text py='2'>
                            ETH Balance: {wBalance}
                        </Text>
                    </CardBody>
                    <CardFooter>
                        <VStack align="flex-start">
                            <HStack>
                                <Button size="sm" disabled>Active Wallet</Button>
                                <Popover>
                                    <PopoverTrigger>
                                        <Button size="sm">Reveal Private Key</Button>
                                    </PopoverTrigger>
                                    <Portal>
                                        <PopoverContent>
                                            <PopoverArrow />
                                            <PopoverHeader fontSize="xs">Private Key</PopoverHeader>
                                            <PopoverCloseButton />
                                            <PopoverBody>
                                                <Text size="sm">{mintWallet?.private_key}</Text>
                                            </PopoverBody>
                                            <PopoverFooter fontSize="xs">Degen Only</PopoverFooter>
                                        </PopoverContent>
                                    </Portal>
                                </Popover>
                                <Popover>
                                    <PopoverTrigger>
                                        <Button size="sm">Sweep Transfer</Button>
                                    </PopoverTrigger>
                                    <Portal>
                                        <PopoverContent>
                                            <PopoverArrow />
                                            <PopoverHeader fontSize="xs">Sweep Transfer</PopoverHeader>
                                            <PopoverCloseButton />
                                            <PopoverBody >
                                                <form onSubmit={handleSubmit(onSubmit)}>
                                                    <VStack gap="0.5rem">
                                                        <Input placeholder='Wallet Address'  {...register("address", { required: true })} />
                                                        {/* <VStack>

                                                            <VStack w="100%" align="flex-start">
                                                                <Input placeholder={portfolio?.data?.[1]?.attributes?.fungible_info?.name} value={portfolio?.data?.[1]?.attributes?.fungible_info.implementations[0].address}  {...register("amount", { required: true })} />
                                                                <Input placeholder={portfolio?.data?.[1]?.attributes.quantity.int} value={portfolio?.data?.[1]?.attributes.quantity.int}  {...register("amount", { required: true })} />
                                                            </VStack>

                                                        </VStack> */}
                                                        <Button type="submit" w="100%">Sweep Send</Button>
                                                    </VStack>
                                                </form>
                                            </PopoverBody>
                                            <PopoverFooter fontSize="xs">This will sweep all the ETH from this wallet and place it in another account. It will not transfer your other coins.</PopoverFooter>
                                        </PopoverContent>
                                    </Portal>
                                </Popover>
                            </HStack>
                            <Text fontSize="xs">This should be considered as an exposed burner wallet</Text>
                        </VStack>
                    </CardFooter>
                </Stack>
            </Card> : <Card
                direction={{ base: 'column', sm: 'row' }}
                overflow='hidden'
                variant='outline'
                w="500px"
                bgColor="blackAlpha.900"
            >
                <Stack>
                    <CardBody>
                        <Heading size='sm'>{mintWallet?.public_key}</Heading>
                        <Text py='2'>
                            ETH Balance: {wBalance}
                        </Text>
                    </CardBody>
                    <CardFooter>
                        <VStack align="flex-start">
                            <HStack>
                                <Button size="sm" onClick={handleMakeActive}>Make Active</Button>
                                <Popover>
                                    <PopoverTrigger>
                                        <Button size="sm">Reveal Private Key</Button>
                                    </PopoverTrigger>
                                    <Portal>
                                        <PopoverContent>
                                            <PopoverArrow />
                                            <PopoverHeader fontSize="xs">Private Key</PopoverHeader>
                                            <PopoverCloseButton />
                                            <PopoverBody>
                                                <Text size="sm">{mintWallet?.private_key}</Text>
                                            </PopoverBody>
                                            <PopoverFooter fontSize="xs">Degen Only</PopoverFooter>
                                        </PopoverContent>
                                    </Portal>
                                </Popover>
                                <Popover>
                                    <PopoverTrigger>
                                        <Button size="sm">Sweep Transfer</Button>
                                    </PopoverTrigger>
                                    <Portal>
                                        <PopoverContent>
                                            <PopoverArrow />
                                            <PopoverHeader fontSize="xs">Sweep Transfer</PopoverHeader>
                                            <PopoverCloseButton />
                                            <PopoverBody>
                                                <form onSubmit={handleSubmit(onSubmit)}>
                                                    <VStack gap="0.5rem">
                                                        <Input placeholder='Wallet Address'  {...register("address", { required: true })} />
                                                        <Button type="submit" w="100%">Sweep Send</Button>
                                                    </VStack>
                                                </form>
                                            </PopoverBody>
                                            <PopoverFooter fontSize="xs">This will sweep all the funds from this wallet and place it in another account.</PopoverFooter>
                                        </PopoverContent>
                                    </Portal>
                                </Popover>
                            </HStack>
                            <Text fontSize="xs">This should be considered as an exposed burner wallet</Text>
                        </VStack>
                    </CardFooter>

                </Stack>
            </Card>
            }
        </VStack >
    );
}

export default WalletCard;


