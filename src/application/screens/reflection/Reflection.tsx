import clsx from 'clsx';
import Sidebar from '../../components/_sidebar/Sidebar';
import './ReflectionStyle.css';


import { useRecoilState, useRecoilValue } from 'recoil';
import { API } from '../../../core/api/handles';
import { DROPDOWN_DATES_SEPARATOR } from '../home/constants';
import ReflectionSprintsAtom from '../../../core/atoms/reflection.atom';
import { useState, useEffect } from 'react';
import DropdownSelector, { DropdownItem } from '../../../Platform/_dropdownSelector/DropdownSelector';
import { formatDate } from '../../../core/api/utils/dateCutter';
import { ReflectionDropdownSelectedAtom } from '../../../core/atoms/screensDropdown.atom';
import { ReflectionResponseType } from '../../../core/api/actions/reflection';
import { transformReflections } from '../../../core/api/utils/reflectionAnswersTransformer.ts';
import ReflectionRegistry from '../../components/_registry/ReflectionRegistry.tsx';


const ReflectionScreen = () => {

    const Reflection = useRecoilValue(ReflectionSprintsAtom);

    const [selectedDropdownItem, setSelectedDropdownItem] = useRecoilState(
        ReflectionDropdownSelectedAtom
    );

    const [dropdownItems, setdropdownItems] = useState<DropdownItem<string>[]>(
        []
    );

    const [ReflectionsPromise, setReflectionsPromise] = useState(null);

    const [items, setItems] = useState<ReflectionResponseType[]>();


    //========= USE EFFECTS ===========
    useEffect(() => {
        const newItems: DropdownItem<string>[] = [];

        Reflection.map((sprint) => {
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
    }, [Reflection]);

    useEffect(() => {
        if (selectedDropdownItem?.value || selectedDropdownItem?.value == '0') {
            setReflectionsPromise(() =>
                API.REFLECTION.GetReflection(selectedDropdownItem.value)
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
                        answerNumber: resProj.answerNumber,
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


    useEffect(() => {
        document.body.className = 'body-color-white';
    }, []);

    return (
        <div className='Reflection-container'>
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
            <h3>Кажется, в выбранный спринт не было ни одной рефлексии...</h3>
        </div>
    );
};

export default ReflectionScreen;




//            { transformReflections(items) ? items.length > 0 ? transformReflections(items).map((item) => <ReflectionRegistry 
//number={item.number}/>) : <h3>Кажется, в выбранный спринт не было ни одной рефлексии...</h3> : <h3>Кажется, в выбранный спринт не было ни одной рефлексии...</h3>}
