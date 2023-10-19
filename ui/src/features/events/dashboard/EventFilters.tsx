import { observer } from "mobx-react-lite"
import React from "react"
import Calendar from "react-calendar"
import { Button, Header, Menu } from "semantic-ui-react"
import { useStore } from "../../../app/stores/store"

export default observer(function EventFilters() {
    const {eventStore: {predicate, setPredicate}} = useStore()

    return (
        <>
            <Menu vertical size='large' style={{ width: '100%' }}>
                <Header icon='filter' attached color='blue' content='Filters' />
                <Menu.Item
                    content='All events' 
                    active={predicate.has('all')}
                    onClick={() => setPredicate('all', 'true')}
                />
                <Menu.Item 
                    content='Attending'
                    active={predicate.has('isGoing')}
                    onClick={() => setPredicate('isGoing', 'true')}
                />
                <Menu.Item 
                    content='Hosting' 
                    active={predicate.has('isHost')}
                    onClick={() => setPredicate('isHost', 'true')}
                />
            </Menu>
            <Calendar 
                onChange={(date) => setPredicate('startDate', date as Date)}
                value={predicate.get('startDate') || new Date()}
            />
            <Button 
                floated='right' 
                onClick={() => [setPredicate('all', 'true'), () => setPredicate('isHost', 'true')]} 
                content='Reset filters'
                style={{
                    color: 'white',
                    backgroundColor: '#1e1e1f',
                    borderColor: '#ddd', 
                    borderWidth: '2px' ,
                    marginTop: '5px'
                }} 
            />
        </>
    )
})