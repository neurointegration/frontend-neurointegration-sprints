import { useState, useEffect, useLayoutEffect, Fragment } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import {
    PossibleDatesResponseKeysType,
    SprintResponseType,
} from '../../../core/api/actions/sprints';
import { API } from '../../../core/api/handles';
import { cutDate, formatDate } from '../../../core/api/utils/dateCutter';
import MeInformationAtom from '../../../core/atoms/me.atom';
import {
    ClientReflectionDropdownSelectedAtom,
    ClientSprintDropdownSelectedAtom,
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
import ReflectionScreen from '../reflection/Reflection';
import ClientsNavbar from '../../components/_sidebar/ClientsNavbar';
import clsx from 'clsx';
import ReflectionRegistry from '../../components/_registry/ReflectionRegistry';
import Sidebar from '../../components/_sidebar/Sidebar';
import ReflectionGrid from '../../components/grids/ReflectionGrid';
import { transformReflections } from '../../../core/api/utils/reflectionAnswersTransformer';
import { ReflectionResponseType } from '../../../core/api/actions/reflection';

function ClientReflectionScreen() {
    const params = useParams();
    const clientId = params.clientId;
    const { wait, loading } = useHttpLoader();
    const [sprints, setSprints] = useState<SprintResponseType[]>();

    const [selectedDropdownItem, setSelectedDropdownItem] = useRecoilState(
        ClientReflectionDropdownSelectedAtom
    );

    const [dropdownItems, setdropdownItems] = useState<
        DropdownItem<string>[]
    >([]);

    const [ReflectionsPromise, setReflectionsPromise] = useState(null);


    const [items, setItems] = useState<ReflectionResponseType[]>();
    

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
                setReflectionsPromise(() =>
                    API.TRAINER.REFLECTION.GetReflection(clientId, selectedDropdownItem.value)
                );
            }
        }, [selectedDropdownItem]);
    
    
        useEffect(() => {
            ReflectionsPromise?.then((res) => {
                const newItems: ReflectionResponseType[] = [];
                if (res.isSuccess) {
                    res.body.map((resProj) => {
                        const item: ReflectionResponseType = {
                            answerType: resProj.answerType,
                            sprintReplyNumber: resProj.sprintReplyNumber,
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
        }, [ReflectionsPromise]);
    const cards = transformReflections(items) && items.length > 0 ? transformReflections(items) : undefined;


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

            { cards ? 
            <Fragment>
                <div className='reflection-desktop'>
                    <ReflectionGrid props={cards}/>
                </div>
                <div className='reflection-mobile'>
                    {cards.slice(0, 3).map((item) => <ReflectionRegistry number={item.number} reflectionType={item.reflectionType} cards={item.cards}/>)}
                    <ReflectionRegistry number={cards[3].number} reflectionType={cards[3].reflectionType} cards={cards[3].cards}/>
                </div>
            </Fragment>
            :
            <h3>Кажется, в выбранный спринт не было ни одной рефлексии...</h3>
            }

        </>
    );
}

export default ClientReflectionScreen;
