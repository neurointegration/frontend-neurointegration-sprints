import { ReflectionCardProps } from "../../application/components/_cards/ReflectionCard"

export type IntegrationReflectionType = {
    Changes : ReflectionCardProps,
    Actions : ReflectionCardProps,
    Abilities : ReflectionCardProps,
    Beliefs : ReflectionCardProps,
    SelfPerception : ReflectionCardProps,
    Opportunities : ReflectionCardProps,	
}

export type RegularReflectionType = {	
    Doing : ReflectionCardProps,
    State : ReflectionCardProps,
    Orbits : ReflectionCardProps,
    Correction : ReflectionCardProps,
}

export type CommonReflectionType = {
    Changes : ReflectionCardProps,
    Actions : ReflectionCardProps,
    Abilities : ReflectionCardProps,
    Beliefs : ReflectionCardProps,
    SelfPerception : ReflectionCardProps,
    Opportunities : ReflectionCardProps,	
    Doing : ReflectionCardProps,
    State : ReflectionCardProps,
    Orbits : ReflectionCardProps,
    Correction : ReflectionCardProps,
}


export enum reflectionClassNames {
  Changes = "changes",
  Actions = "actions",
  Abilities = "abilities",
  Beliefs = "beliefs",
  SelfPerception = "self-perception",
  Opportunities = "opportunities",	

  Doing = "doing",
  State = "my-status",
  Orbits = "orbits",
  Correction = "correction",

  Default = ''
}