import React, { SyntheticEvent, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Tab, Grid, Header, Card, Image, TabProps } from 'semantic-ui-react';
import { UserEvent } from '../../../app/models/profile';
import { format } from 'date-fns';
import { useStore } from '../../../app/stores/store';

const panes = [
    { menuItem: 'Future Events', pane: { key: 'all' } },
    { menuItem: 'Past Events', pane: { key: 'past' } },
    { menuItem: 'Hosting', pane: { key: 'hosting' } }
];

export default observer(function ProfileEvents() {
    const { profileStore } = useStore();
    const {
        loadUserEvents,
        profile,
        loadingEvents,
        userEvents
    } = profileStore;

    useEffect(() => {
        loadUserEvents(profile!.userName);
    }, [loadUserEvents, profile]);

    const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
        loadUserEvents(profile!.userName, panes[data.activeIndex as number].pane.key);
    };

    return (
        <Tab.Pane loading={loadingEvents}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='calendar' content={'Events'} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        panes={panes}
                        menu={{ secondary: true, pointing: true }}
                        onTabChange={(e, data) => handleTabChange(e, data)}
                    />
                    <br />
                    <Card.Group itemsPerRow={4}>
                        {userEvents.map((event: UserEvent) => (
                            <Card
                                // as={Link}
                                // to={`/Events/${event.id}`}
                                key={event.id}
                            >
                                <Image
                                    src={`/assets/categoryImages/${event.category}.jpg`}
                                    style={{ minHeight: 100, objectFit: 'cover' }}
                                />
                                <Card.Content>
                                    <Card.Header textAlign='center'>{event.title}</Card.Header>
                                    <Card.Meta textAlign='center'>
                                        <div>{format(new Date(event.date), 'do LLL')}</div>
                                        <div>{format(new Date(event.date), 'h:mm a')}</div>
                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
});
