import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useField, useFormikContext } from 'formik'
import { Form, Label, Dropdown } from 'semantic-ui-react'

interface City {
    id: string
    name: string
}

interface CustomCityAutocompleteProps {
    name: string
    label?: string
}

const CustomCityAutocomplete: React.FC<CustomCityAutocompleteProps> = ({ name, label }) => {
    const [field, meta] = useField(name)
    const [suggestions, setSuggestions] = useState<City[]>([])
    const { setFieldValue } = useFormikContext()

    useEffect(() => {
        const fetchCities = async (inputValue: string) => {
            if (inputValue.length < 3) return

            const options = {
                method: 'GET',
                url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
                params: { namePrefix: inputValue },
                headers: {
                    'X-RapidAPI-Key': 'b79f9260f0mshff5167a6254366ep1835e2jsn72d30dcc814a',
                    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
                }
            }

            try {
                const response = await axios.request(options)
                setSuggestions(response.data.data.map((city: any) => ({
                    key: city.id,
                    text: city.name,
                    value: city.name
                })))
            } catch (error) {
                console.error('Error fetching cities', error)
            }
        }

        const timeoutId = setTimeout(() => {
            fetchCities(field.value)
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [field.value])

    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{label}</label>
            <Dropdown
                fluid
                search
                selection
                options={suggestions}
                value={field.value}
                onSearchChange={(e, { searchQuery }) => setFieldValue(name, searchQuery)}
                onChange={(e, { value }) => setFieldValue(name, value)}
                placeholder='Search'
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}

export default CustomCityAutocomplete
