import './newOnboardingStyle.css';
import { Onboarding, OnboardingTypes } from '../../../core/api/actions/me';
import { Icons } from '../../../Platform/_types/Icons';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export enum OnboardingCardsForms {
    Dialog='dialog-card-form',
    DialogDownArrow = 'dialog-down-arrow-card-form',
    Simple='simple-card-form',
}

export type OnboardingProps = {
    type: OnboardingTypes;
    onboardingCardClickHandler: () => void;
    form :  OnboardingCardsForms ;
};

export type OnboardingCardProps = {
    onboardingCardClickHandler: () => void;
    additionalOnboardingCardClickHandler?: () => void;
    number?: number;
    form : OnboardingCardsForms;
};


function OnboardingCard({
    type,
    form, 
    onboardingCardClickHandler, 
}: OnboardingProps) {

    const [projectOnboardingNumber, setprojectOnboardingNumber] = useState(1);

    const onboardingProjectCardClickHandler = 
        projectOnboardingNumber == 1 ?
        () => {setprojectOnboardingNumber(2)} 
        : 
        () => {setprojectOnboardingNumber(1)};

    if (type == OnboardingTypes.DateOnboarding) {
        return <OnboardingDateCard form={form} onboardingCardClickHandler={onboardingCardClickHandler}/>
    } else if (type == OnboardingTypes.ClientsOnboarding) {
        return <OnboardingClientsCard form={form} onboardingCardClickHandler={onboardingCardClickHandler}/>
    } else if (type == OnboardingTypes.EditingOnboarding) {
        return <OnboardingEditingCard form={form} onboardingCardClickHandler={onboardingCardClickHandler}/>
    } else {
        return <OnboardingProjectCard form={form} onboardingCardClickHandler={onboardingCardClickHandler} 
        additionalOnboardingCardClickHandler={onboardingProjectCardClickHandler}
        number={projectOnboardingNumber}
        />
    };
}

function OnboardingDateCard({onboardingCardClickHandler, form} : OnboardingCardProps){
    const inputRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
    inputRef.current?.focus();
  }, []);
 return(
  <dialog className={clsx("dialog-card card-type-cross " + form)}
    aria-modal="true"
    open
  >
    <div>
    <p className='onboarding-text'>Можно выбрать период, за&nbsp;который отобразятся проекты&nbsp;—&nbsp;конкретную неделю или весь спринт</p>
    </div>
    <button className='onboarging-complete-button' aria-label='Закрыть' autoFocus={true} ref={inputRef} onClick={onboardingCardClickHandler} tabIndex={3}>
        <img className='cross-icon' src={Icons.cross} />
    </button>
  </dialog>
 )
}

function OnboardingClientsCard({onboardingCardClickHandler, form} : OnboardingCardProps){
    const inputRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
    inputRef.current?.focus();
  }, []);
 return(
  <dialog className={clsx("dialog-card card-type-cross " + form)}
    aria-modal="true"
    open
  >
    <div>
    <p className='onboarding-text'>Тренер может оставить заметки на&nbsp;карточке клиента&nbsp;—&nbsp;клиент их не&nbsp;увидит.</p>
    <p className='onboarding-text'>А если нажать на&nbsp;карточку, то&nbsp;можно будет работать со&nbsp;спринтом, стендапом и рефлексией клиента.</p>
    </div>
    <button className='onboarging-complete-button' aria-label='Закрыть' ref={inputRef} autoFocus={true} onClick={onboardingCardClickHandler} tabIndex={3}>
        <img className='cross-icon' src={Icons.cross} />
    </button>
  </dialog>
 )
}

function OnboardingEditingCard({onboardingCardClickHandler, form} : OnboardingCardProps){

    const inputRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
    inputRef.current?.focus();
  }, []);

 return(
  <dialog className={clsx("dialog-card card-type-cross " + form)}
    aria-modal="true"
    open
  >
    <div>
    <p className='onboarding-text'>На&nbsp;странице редактирования можно изменить количество времени для&nbsp;проекта или задачи.</p>
    <p className='onboarding-text'>А ещё обозначить цветом результаты.</p>
    </div>
    <button className='onboarging-complete-button' aria-label='Закрыть' ref={inputRef} autoFocus={true} onClick={onboardingCardClickHandler} tabIndex={3}>
        <img className='cross-icon' src={Icons.cross} />
    </button>
  </dialog>
 )
}

function OnboardingProjectCard({form, onboardingCardClickHandler, additionalOnboardingCardClickHandler = ()=>{}, number=1} : OnboardingCardProps){
    const inputRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
    inputRef.current?.focus();
  }, []);
    
    if (number == 1) {
    return (
    <dialog className={clsx("dialog-card card-type-down-button " + form)}
    aria-modal="true"
    open
    aria-live='polite'
    >
        <div className='dialog-card_text-container direction-left'>
        <p className='onboarding-text'>В&nbsp;карточке проекта можно увидеть, сколько времени было запланировано на&nbsp;проект и потрачено на&nbsp;самом деле. По&nbsp;неделям и общее, за&nbsp;весь спринт.</p>
        <button className='onboarging-arrow-button' ref={inputRef} autoFocus={true} onClick={additionalOnboardingCardClickHandler} tabIndex={3} aria-label='Дальше'>
            Дальше 
        <img className='left-arrow-icon' aria-hidden src={Icons.arrow} />
        </button>
        </div>
    </dialog>
 )} else {
    return (
    <dialog className={clsx("dialog-card card-type-down-button " + form)}
        aria-modal="true"
        open
        aria-live='polite'

    >
        <div className='dialog-card_text-container direction-right'>
        <p className='onboarding-text'>Нажмите на&nbsp;стрелочку в&nbsp;углу проекта, чтобы работать с&nbsp;задачами. А&nbsp;чтобы отредактировать проект&nbsp;—&nbsp;нажмите на&nbsp;него в&nbsp;любом другом месте.</p>
        <button className='onboarging-arrow-button' onClick={additionalOnboardingCardClickHandler} tabIndex={3}>
            <img className='right-arrow-icon' aria-hidden src={Icons.arrow} />
            Назад 
        </button>
        </div>
        <button className='onboarging-complete-button' aria-label='Закрыть' onClick={onboardingCardClickHandler} tabIndex={3}>
            <img className='cross-icon' src={Icons.cross} />
        </button>
    </dialog>
 )
 }
}

export default OnboardingCard;


