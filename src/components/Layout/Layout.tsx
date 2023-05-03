import { VStack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";

const NavBar = dynamic(() => import("../NavBar/NavBar"), { ssr: false });

interface LayoutProps {
    children: any;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <VStack minH="100vh" bgColor="black" w="100%">
            <NavBar />
            {children}
        </VStack>
    );
};

export default Layout;
