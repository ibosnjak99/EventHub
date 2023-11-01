import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import Calendar from "react-calendar"
import { Button, Header, Icon, Input, Menu } from "semantic-ui-react"
import { useStore } from "../../../app/stores/store"

function EventFilters({ closeModal }: { closeModal: () => void }) {
    const { eventStore: { predicate, setPredicate } } = useStore()
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleIconClick = () => {
        setPredicate('searchTerm', searchTerm)
        setSearchTerm('')
        closeModal()
    } 

    return (
        <>
            <Menu vertical size='large' style={{ width: '100%' }}>
                <Header icon='filter' attached color='blue' content='Filters' />
                <Menu.Item
                    content='All events' 
                    active={predicate.has('all')}
                    onClick={() => {
                        setPredicate('all', 'true')
                        closeModal()
                    }}
                />
                <Menu.Item 
                    content='Attending'
                    active={predicate.has('isGoing')}
                    onClick={() => {
                        setPredicate('isGoing', 'true')
                        closeModal()
                    }}
                />
                <Menu.Item 
                    content='Hosting' 
                    active={predicate.has('isHost')}
                    onClick={() => {
                        setPredicate('isHost', 'true')
                        closeModal()
                    }}
                />
                <Menu.Item
                    content='Following' 
                    active={predicate.has('isFollowing')}
                    onClick={() => {
                        setPredicate('isFollowing', 'true')
                        closeModal()
                    }}
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
                onChange={(date) => {
                    setPredicate('startDate', date as Date)
                    closeModal()
                }}
                value={predicate.get('startDate') || new Date()}
            />
            <Button 
                floated='right' 
                onClick={() => {
                    setPredicate('all', 'true')
                    setPredicate('startDate', new Date())
                    setSearchTerm('')
                    closeModal()
                }} 
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
}

export default observer(EventFilters)
