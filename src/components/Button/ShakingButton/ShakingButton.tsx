import { Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { MouseEventHandler, ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react";

export default function ShakingButton(props: { onClick: MouseEventHandler<HTMLButtonElement> | undefined; children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; }) {
    return (
        <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 0 }}
            whileHover={{
                scale: 1.1,
                rotate: [-10, 10, -10, 0],
                transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.9 }}
        >
            <Button
                rounded="none"
                variant="outline"
                onClick={props.onClick}
            >
                {props.children}
            </Button>
        </motion.div>
    );
}
