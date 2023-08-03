import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Image, List } from 'semantic-ui-react';
import { Profile } from '../../../app/models/profile';

interface Props {
    attendees: Profile[];
}

export default observer(function EventListItemAttendee({attendees}: Props) {
    console.log(attendees[0]);
    return (
        <List horizontal>
            {attendees.map(attendee => (
                <List.Item key={attendee.userName} as={Link} to={`/profiles/${attendee.userName}`}>
                    <Image 
                        size='mini' 
                        circular 
                        src={ attendee.image || '/assets/user.png' }
                        style={{border: '.6px solid #d1d1d1'}}
                    />
                <List.Header style={{ fontSize: '.9em', textAlign: 'center' }}>
                    {attendee.userName}
                </List.Header>
                </List.Item>
            ))}
        </List>
    );
});
