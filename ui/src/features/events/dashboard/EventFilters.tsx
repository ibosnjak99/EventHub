import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import Calendar from "react-calendar"
import { Button, Header, Icon, Input, Menu } from "semantic-ui-react"
import { useStore } from "../../../app/stores/store"

export default observer(function EventFilters() {
    const { eventStore: { predicate, setPredicate } } = useStore()
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleIconClick = () => {
        setPredicate('searchTerm', searchTerm)
        setSearchTerm('')
    } 

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
                <Menu.Item
                    content='Following' 
                    active={predicate.has('isFollowing')}
                    onClick={() => setPredicate('isFollowing', 'true')}
                />
            </Menu>
            <Input 
                fluid
                placeholder="Search..." 
                value={searchTerm}
                onChange={handleSearchTermChange} 
                style={{ marginBottom: '10px' }}
                icon={<Icon name='search' link onClick={handleIconClick} />}
            />
            <Calendar 
                onChange={(date) => setPredicate('startDate', date as Date)}
                value={predicate.get('startDate') || new Date()}
            />
            <Button 
                floated='right' 
                onClick={() => [setPredicate('all', 'true'), setPredicate('startDate', new Date()), setSearchTerm('')]} 
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