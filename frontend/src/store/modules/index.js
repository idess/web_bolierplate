import { notes, notesEpics } from "./notes";
import { auth, authEpics } from "./auth";
import { accounts, accountsEpics } from "./Accounts";
import { userRules, userRulesEpics } from "./UserRules";
import { userDepts, userDeptsEpics } from "./UserDepartments";
import { auditLog, auditLogEpics } from "./Audit";
import { categories, categoriesEpics } from "./Category";
import { services, servicesEpics } from "./Service";
import { search, searchEpics } from "./Search";

import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";
import { routerReducer } from "react-router-redux";

export const rootReducers = combineReducers( { routing: routerReducer, notes, auth, accounts, userRules, userDepts, auditLog, categories, services, search });
export const rootEpics = combineEpics(
    notesEpics.addNoteEpic,
    notesEpics.getNotesEpic,
    notesEpics.updateNoteEpic,
    notesEpics.deleteNoteEpic,
    notesEpics.getMoreNotesEpic,

    authEpics.loginEpic,
    authEpics.registerEpic,
    authEpics.checkUserEpic,
    authEpics.logoutEpic,

    accountsEpics.accountsEpic,
    accountsEpics.accountsCreateEpic,
    accountsEpics.accountsUpdateEpic,
    accountsEpics.accountsDeleteEpic,

    userRulesEpics.userRulesEpic,
    userRulesEpics.userRulesCreateEpic,
    userRulesEpics.userRulesUpdateEpic,
    userRulesEpics.userRulesDeleteEpic,

    userDeptsEpics.userDeptsEpic,
    userDeptsEpics.userDeptsCreateEpic,
    userDeptsEpics.userDeptsUpdateEpic,
    userDeptsEpics.userDeptsDeleteEpic,

    auditLogEpics.auditLogEpic,

    categoriesEpics.categoriesEpic,
    categoriesEpics.categoriesCreateEpic,
    categoriesEpics.categoriesUpdateEpic,
    categoriesEpics.categoriesDeleteEpic,

    servicesEpics.servicesEpic,
    servicesEpics.servicesCreateEpic,
    servicesEpics.servicesUpdateEpic,
    servicesEpics.servicesDeleteEpic,
    servicesEpics.productEpic,
    servicesEpics.vendorEpic,
    servicesEpics.codeEpic,

    searchEpics.searchEpic,
    searchEpics.searchFieldEpic,
    searchEpics.searchSaveEpic,
    searchEpics.searchDetailEpic
);

