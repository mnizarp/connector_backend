import express from 'express'
import { addNewCountry, country_list_unlist, getCountries } from '../controllers/adminControllers/countryController'
import { adminProtect } from '../middlewares/adminAuthMiddleware'

const countryRouter=express.Router()

countryRouter.post('/addnewcountry',addNewCountry)
countryRouter.get('/getCountries',getCountries)
countryRouter.patch('/countrylistupdate',adminProtect,country_list_unlist)

export default countryRouter