import { useState, useEffect, useLayoutEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import {
    PossibleDatesResponseKeysType,
    SprintResponseType,
} from '../../../core/api/actions/sprints';
import { API } from '../../../core/api/handles';
import { cutDate, formatDate } from '../../../core/api/utils/dateCutter';
import MeInformationAtom from '../../../core/atoms/me.atom';
import {
    ClientSprintDropdownSelectedAtom,
    ClientStandupDropdownSelectedAtom,
    SprintDropdownSelectedAtom,
} from '../../../core/atoms/screensDropdown.atom';
import CurrentSprintAtom from '../../../core/atoms/sprint.atom';
import DropdownSelector, { DropdownItem } from '../../../Platform/_dropdownSelector/DropdownSelector';
import BaseRegistry, { BaseRegistryProps } from '../home/BaseRegistry';
import {
    SprintWeekDropdownValueType,
    DROPDOWN_DATES_SEPARATOR,
    BaseRegistryType,
} from '../home/constants';
import useHttpLoader from '../../../core/api/hooks/useHttpLoader';
import { useParams } from 'react-router-dom';
import Spoiler from '../../../Platform/_buttons/Spoiler';
import LoadingScreen from '../loading/Loading';
import { ClientResponseType } from '../../../core/api/actions/trainer.clients';

import './ClientSprintStyle.css';
import StandupScreen from '../standup/Standup';
import ClientsNavbar from '../../components/_sidebar/clientsNavbar';
import { transformStandups } from '../../../core/api/utils/standupAnswersTransformer';
import StandupCard from '../../components/_cards/StandupCard';
import { StandupResponseType } from '../../../core/api/actions/standup';
import clsx from 'clsx';
import Sidebar from '../../components/_sidebar/Sidebar';

function ClientStandupScreen() {
    const params = useParams();
    const clientId = params.clientId;
    const { wait, loading } = useHttpLoader();
    const [sprints, setSprints] = useState<SprintResponseType[]>();

    const [selectedDropdownItem, setSelectedDropdownItem] = useRecoilState(
        ClientStandupDropdownSelectedAtom
    );

    const [dropdownItems, setdropdownItems] = useState<
        DropdownItem<string>[]
    >([]);

    const [standupsPromise, setStandupsPromise] = useState(null);


    const [items, setItems] = useState<StandupResponseType[]>();
    

    const [client, setClient] = useState<ClientResponseType>({
        id: clientId,
        username: null,
        firstName: null,
        lastName: null,
        aboutMe: null,
        photoUrl: null,
    });

    const [comment, setComment] = useState<string>(null);

    //========= USE EFFECTS ===========
    useEffect(() => {
        wait(API.TRAINER.SPRINTS.Sprints(clientId), (resp) => {
            if (resp.isSuccess) {
                if (resp.body.length) {
                    setSprints(() => resp.body);
                }
            }
        });

        wait(API.TRAINER.CLIENTS.Client(clientId), (resp) => {
            if (resp.isSuccess) {
                setClient(() => ({ ...resp.body }));
            }
        });

        wait(API.TRAINER.COMMENTS.GetComment(clientId), (resp) => {
            if (resp.isSuccess) {
                setComment(() => resp.body.commentText);
            }
        });
    }, []);



    useEffect(() => {
        const newItems: DropdownItem<string>[] = [];
        if (sprints) {
        sprints.map((sprint) => {
            const begin = sprint.beginDate;
            const end = sprint.endDate;
            const caption =
                begin && end
                    ? `${formatDate(
                            begin
                        )}${DROPDOWN_DATES_SEPARATOR}${formatDate(end)}`
                    : 'Срок неопределён';

            newItems.push({
                caption: caption,
                value: sprint.number,
            });
        });

        setdropdownItems(() => [...newItems]);
        setSelectedDropdownItem((prev) => {
            const values = newItems.filter((item) => item.value === prev?.value);

            return values.length ? prev : newItems[newItems.length - 1];
        });
    }
    }, [sprints]);
    
    
        useEffect(() => {
            if (selectedDropdownItem?.value || selectedDropdownItem?.value == '0') {
                setStandupsPromise(() =>
                    API.TRAINER.STANDUP.GetStandup(clientId, selectedDropdownItem.value)
                );
            }
        }, [selectedDropdownItem]);
    
    
        useEffect(() => {
            standupsPromise?.then((res) => {
                const newItems: StandupResponseType[] = [];
                if (res.isSuccess) {
                    res.body.map((resProj) => {
                        const item: StandupResponseType = {
                            answerType: resProj.answerType,
                            sprintNumber: resProj.sprintNumber,
                            date: resProj.date,
                            answer: resProj.answer
                        };
                        newItems.push(item);
                        }
                    );
                }
                setItems(() => (newItems));
            });
        }, [standupsPromise]);


    return loading ? (
        <LoadingScreen />
    ) : (
        <>
            <Sidebar
                menuButtonClassName={clsx(
                    'controls-margin_top-s',
                    'controls-margin_left-3xl'
                )}
            />
            <Spoiler
                title={client?.firstName || 'Имя клиента'}
                buttonClassName='clientButtonSpoiler'
            >
                {comment && (
                    <div className='clientButton__comment'>{comment}</div>
                )}
            </Spoiler>
            <ClientsNavbar/>
            <DropdownSelector
                items={dropdownItems}
                useSelectedItem={[
                    selectedDropdownItem,
                    setSelectedDropdownItem,
                ]}
                selectedValueClassName={clsx(
                    'controls-margin_top-xl',
                    'controls-margin_bottom-4xl'
                )}
            />
            { transformStandups(items) ? items.length > 0 ? transformStandups(items).map((item) => <StandupCard 
                date={item.date}
                mentalStates={item.mentalStates}
                wins={item.wins}
                focusLife={item.focusLife}
                focusFun={item.focusFun}
                focusDrive={item.focusDrive} 
                sprintNumber={item.sprintNumber}/>) : <h3>Кажется, в выбранный спринт нет ни одного стендапа...</h3> : <h3>Кажется, в выбранный спринт нет ни одного стендапа...</h3>
            }
        </>
    );
}

export default ClientStandupScreen;
