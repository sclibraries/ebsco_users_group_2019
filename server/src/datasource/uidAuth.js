import { loginHandler, searchHandler } from '../util/search'
import ip from 'ip'
import ipRangeCheck from 'ip-range-check'
import queryString from 'query-string'
import {edsCredentials, edsCredentialsAutoComplete, IPRange } from '../config/credentials'
import {eds, edsauth } from '../config/endpoints'


//Authorization for EDS
export async function login(parent, args, {req}, info, type) {
    const ipCheck = ipRangeCheck(req.connection.remoteAddress.replace(/^.*:/, ''), IPRange)
    let guest = "y"
    if(ipCheck === true) {
        guest = 'n'
    }

    
    if(req.session.authorizeToken && req.session.sessionToken){
        return {
            SessionToken: req.session.sessionToken,
            AuthToken: req.session.authorizeToken,
            AutoCompleteToken: req.session.autoCompleteToken,
            AutoCompleteURL: req.session.autoCompleteURL,
            guest: req.session.guest
        }
    } else {
    const authorize = await loginHandler(
        `${edsauth}/UIDAuth`, 
        {
            'Content-Type': 'application/json', 
            'Accept': 'application/json',
            'charset': 'utf-8'
        }, 
        edsCredentials, 
        'POST'
    )

    const autoComplete = await loginHandler(
        `${edsauth}/UIDAuth`, 
        {
            'Content-Type': 'application/json', 
            'Accept': 'application/json',
            'charset': 'utf-8'
        }, 
        edsCredentialsAutoComplete, 
        'POST'
    )

    const sessionData = await searchHandler(
        `${eds}/CreateSession?profile=edsapi&Guest=${guest}`, 
        {
            'Content-Type': 'application/json', 
            'Accept': 'application/json', 
            'charset': 'utf-8',
            'x-authenticationToken': authorize.AuthToken
        }
    )


    req.session.authorizeToken = authorize.AuthToken
    req.session.sessionToken = sessionData.SessionToken
    req.session.autoCompleteToken = autoComplete.Autocomplete.Token
    req.session.autoCompleteURL = autoComplete.Autocomplete.Url
    return {
        SessionToken: req.session.sessionToken,
        AuthToken: req.session.authorizeToken,
        AutoCompleteToken: req.session.autoCompleteToken,
        AutoCompleteURL: req.session.autoCompleteURL,
        guest: req.session.guest
        }
    }
}