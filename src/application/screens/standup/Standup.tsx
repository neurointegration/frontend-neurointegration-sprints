import clsx from 'clsx';
import Sidebar from '../../components/_sidebar/Sidebar';
import './StandupStyle.css';
import StandupCard from '../../components/_cards/StandupCard';


import { useRecoilState, useRecoilValue } from 'recoil';
import { API } from '../../../core/api/handles';
import { DROPDOWN_DATES_SEPARATOR } from '../home/constants';
import StandupSprintsAtom from '../../../core/atoms/standup.atom';
import { useState, useEffect } from 'react';
import DropdownSelector, { DropdownItem } from '../../../Platform/_dropdownSelector/DropdownSelector';
import { formatDate } from '../../../core/api/utils/dateCutter';
import { StandupDropdownSelectedAtom } from '../../../core/atoms/screensDropdown.atom';
import { StandupResponseType } from '../../../core/api/actions/standup';
import { transformStandups } from '../../../core/api/utils/standupAnswersTransformer';


const StandupScreen = () => {

    const standup = useRecoilValue(StandupSprintsAtom);

    const [selectedDropdownItem, setSelectedDropdownItem] = useRecoilState(
        StandupDropdownSelectedAtom
    );

    const [dropdownItems, setdropdownItems] = useState<DropdownItem<string>[]>(
        []
    );

    const [standupsPromise, setStandupsPromise] = useState(null);

    const [items, setItems] = useState<StandupResponseType[]>();


    //========= USE EFFECTS ===========
    useEffect(() => {
        const newItems: DropdownItem<string>[] = [];

        standup.map((sprint) => {
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
    }, [standup]);

    useEffect(() => {
        if (selectedDropdownItem?.value || selectedDropdownItem?.value == '0') {
            setStandupsPromise(() =>
                API.STANDUP.GetStandup(selectedDropdownItem.value)
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


    useEffect(() => {
        document.body.className = 'body-color-white';
    }, []);

    return (
        <div className='standup-container'>
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
            { transformStandups(items) ? items.length > 0 ? transformStandups(items).map((item) => <StandupCard 
                date={item.date}
                mentalStates={item.mentalStates}
                wins={item.wins}
                focusLife={item.focusLife}
                focusFun={item.focusFun}
                focusDrive={item.focusDrive} 
                sprintNumber={item.sprintNumber}/>) : <h3>Кажется, в выбранный спринт нет ни одного стендапа...</h3> : <h3>Кажется, в выбранный спринт нет ни одного стендапа...</h3>
            }
        </div>
    );
};

export default StandupScreen;