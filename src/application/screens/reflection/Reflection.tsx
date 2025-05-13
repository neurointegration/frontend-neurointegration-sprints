import clsx from 'clsx';
import Sidebar from '../../components/_sidebar/Sidebar';
import './ReflectionStyle.css';
import '../../../Platform/_common-custom/EmptyListLabelStyle.css'

import { useRecoilState, useRecoilValue } from 'recoil';
import { API } from '../../../core/api/handles';
import { DROPDOWN_DATES_SEPARATOR } from '../home/constants';
import ReflectionSprintsAtom from '../../../core/atoms/reflection.atom';
import { useState, useEffect, Fragment } from 'react';
import DropdownSelector, { DropdownItem } from '../../../Platform/_dropdownSelector/DropdownSelector';
import { formatDate } from '../../../core/api/utils/dateCutter';
import { ReflectionDropdownSelectedAtom } from '../../../core/atoms/screensDropdown.atom';
import { ReflectionResponseType } from '../../../core/api/actions/reflection';
import { ReflectionTypes, transformReflections } from '../../../core/api/utils/reflectionAnswersTransformer.ts';
import ReflectionRegistry from '../../components/_registry/ReflectionRegistry.tsx';
import ReflectionGrid from '../../components/grids/ReflectionGrid.tsx';
import { useParams } from 'react-router-dom';


const ReflectionScreen = () => {

    const params = useParams();
    const isClientReflection = params.clientId ? true : false;

    const Reflection = useRecoilValue(ReflectionSprintsAtom);

    const [selectedDropdownItem, setSelectedDropdownItem] = useRecoilState(
        ReflectionDropdownSelectedAtom
    );

    const [dropdownItems, setdropdownItems] = useState<DropdownItem<string>[]>(
        []
    );

    const [reflectionsPromise, setReflectionsPromise] = useState(null);

    const [items, setItems] = useState<ReflectionResponseType[]>();


    //========= USE EFFECTS ===========
    useEffect(() => {
        const newItems: DropdownItem<string>[] = [];

        [...Reflection].sort((a, b) => Date.parse(b.beginDate) - Date.parse(a.beginDate)).map((sprint) => {
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
            return selectedDropdownItem ? (values.length ? prev : selectedDropdownItem) : (values.length ? prev : newItems[0]);
        });
    }, [Reflection]);

    useEffect(() => {
        if (selectedDropdownItem?.value || selectedDropdownItem?.value == '0') {
            setReflectionsPromise(() =>
                API.REFLECTION.GetReflection(selectedDropdownItem.value)
            );
        }
    }, [selectedDropdownItem]);


    useEffect(() => {
        reflectionsPromise?.then((res) => {
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
    }, [reflectionsPromise]);


    useEffect(() => {
        document.body.className = 'body-color-white';
    }, []);


    const cards = transformReflections(items) && items.length > 0 ? transformReflections(items) : undefined;

    return (
        <div className='reflection-container'>
            <Sidebar
                menuButtonClassName={clsx(
                    'controls-margin_top-s',
                    'controls-margin_left-3xl'
                )}
            />
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
            <h3 className='empty-list-label'>Кажется, в выбранный спринт не было ни одной рефлексии...</h3>
            }
            
        </div>
    );
};

export default ReflectionScreen;