import { useRecoilState, useRecoilValue } from 'recoil';
import { API } from '../../../core/api/handles';
import BaseRegistry, { BaseRegistryProps } from '../home/BaseRegistry';
import { BaseRegistryType, DROPDOWN_DATES_SEPARATOR } from '../home/constants';
import HistorySprintsAtom from '../../../core/atoms/historySprints.atom';
import { useState, useEffect } from 'react';
import { DropdownItem } from '../../../Platform/_dropdownSelector/DropdownSelector';
import { formatDate } from '../../../core/api/utils/dateCutter';
import { HistoryDropdownSelectedAtom } from '../../../core/atoms/screensDropdown.atom';

function HistoryScreen() {
    const history = useRecoilValue(HistorySprintsAtom);

    const [selectedDropdownItem, setSelectedDropdownItem] = useRecoilState(
        HistoryDropdownSelectedAtom
    );

    const [dropdownItems, setdropdownItems] = useState<DropdownItem<string>[]>(
        []
    );
    const [projectsPromise, setProjectsPromise] = useState(null);

    //========= USE EFFECTS ===========
    useEffect(() => {
        const newItems: DropdownItem<string>[] = [];

        [...history].sort((a, b) => Date.parse(b.beginDate) - Date.parse(a.beginDate)).map((sprint) => {
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
    }, [history]);

    useEffect(() => {
        if (selectedDropdownItem?.value || selectedDropdownItem?.value == '0') {
            setProjectsPromise(() =>
                API.PROJECTS.Projects(selectedDropdownItem.value)
            );
        }
    }, [selectedDropdownItem]);

    // ====================================

    const registryProps: BaseRegistryProps<string> = {
        editingSettings: {
            editProjects: false,
            editTasks: false,
            editInDialogMode: false,
        },
        registryType: BaseRegistryType.History,
        useDropdownItems: [
            dropdownItems,
            selectedDropdownItem,
            setSelectedDropdownItem,
        ],
        projectsSourceMethodPromise: projectsPromise,
        tasksByProjectCallback: (projectId) => API.TASKS.Tasks(projectId),
    };

    return <BaseRegistry {...registryProps} />;
}

export default HistoryScreen;
