import React from 'react';
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter, ModalCloseButton, ModalHeader, Button, Image, Text } from '@chakra-ui/react';
const ProfileModel = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            {children ? (
                <span onClick={onOpen} >{children} </span>
            ) : (
                <span className="material-symbols-outlined"
                    style={
                        {
                            cursor: "pointer",
                            border: "1px solid gray",
                            padding: "2px 5px",
                            borderRadius: "5px",


                        }}
                    onClick={onOpen} >
                    visibility
                </span>
            )}
            <Modal isOpen={isOpen} onClose={onClose} size={"lg"} isCentered >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"3xl"}
                        fontWeight={"700"}
                        display={"flex"}
                        justifyContent={"center"}
                    >{user?.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        width={"100%"}

                    >
                        <Image
                            borderRadius={"full"}
                            boxSize={"150px"}
                            src={user?.pic}
                            alt={user?.name}
                            objectFit={"contain"}
                        />
                        <Text
                            fontSize={"xl"}
                            marginTop={"10px"}
                        >
                            Email: {user?.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default ProfileModel;
