import { CloseIcon } from '@chakra-ui/icons';
import { Badge } from '@chakra-ui/react';
import React from 'react';

const UserBadgeItem = ({ handleFunction, user }) => {
    return (
        <Badge
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            colorScheme="purple"
            cursor="pointer"

        >
            {user.name}
            {/* {admin === user._id && <span> (Admin)</span>} */}
            <CloseIcon
                onClick={handleFunction}
                pl={1} />
        </Badge>
    );
}

export default UserBadgeItem;
