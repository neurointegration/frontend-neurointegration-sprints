import { reflectionClassNames } from '../../../Platform/_types/ReflectionsTypes';
import './ReflectionCardStyle.css';

export type textLabelPairType = {
    index: number;
    label: string;
    text: string[];
}


export type ReflectionCardProps = {
    reflectionCN: reflectionClassNames;
    header: string;
    textLabelPairsArray: textLabelPairType[];
};

function ReflectionCardTextBlock(label: string, text: string[]) {
    return (
        <div className='reflection-card_text-block'>
            <p className='reflection-card-label'>{label}</p>
            {text.map((item) => <p>{item}</p>)}
            <br/>
        </div>
    );
}


function ReflectionCard({
    header, 
    textLabelPairsArray,
}: ReflectionCardProps) {
    return (
        <div className='reflection-card'>
            <p className='reflection-card-header'>{header}</p>
            <div className='reflection-card_text-blocks-container'>
                {textLabelPairsArray.sort((item) => item.index).map((item) => ReflectionCardTextBlock(item.label, item.text))}
            </div>
        </div>
    );
}

export default ReflectionCard;



/*
здесь важна тень

<div style="align-self: stretch; padding: 20px; background: white; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.16); border-radius: 16px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: inline-flex">
  <div style="align-self: stretch; justify-content: center; display: flex; flex-direction: column; color: black; font-size: 12px; font-family: Roboto; font-weight: 500; word-wrap: break-word">ШАГ 3. АНАЛИЗ ОРБИТ.</div>
  <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 12px; display: flex">
    <div style="width: 328px; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
      <div style="width: 328px; flex-direction: column; justify-content: center; align-items: center; gap: 16px; display: flex">
        <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; display: flex">
          <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
            <div style="align-self: stretch; justify-content: center; display: flex; flex-direction: column; color: black; font-size: 12px; font-family: Roboto; font-weight: 500; word-wrap: break-word">Каким образом в моем поведении на этой неделе проявлялись орбиты? Как я выруливал(а)?</div>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 328px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
      <div style="align-self: stretch; justify-content: center; display: flex; flex-direction: column; color: black; font-size: 12px; font-family: Roboto; font-weight: 400; line-height: 14.07px; word-wrap: break-word">Что такое орбиты?...</div>
    </div>
  </div>
</div>
*/

