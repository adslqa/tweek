import React from 'react';
import './IdentityProperty.css';
import ComboBox from '../../../../../components/common/ComboBox/ComboBox';
import Input from '../../../../../components/common/Input/Input';
import * as TypesServices from '../../../../../services/types-service';
import { compose, withState, withHandlers } from 'recompose';
import R from 'ramda';
import { WithContext as ReactTags } from 'react-tag-input';

const TypeCombobox = ({ type, onUpdate, allowedTypes }) =>
  <ComboBox
    value={type}
    filterBy={() => true}
    onChange={propType => onUpdate(propType)}
    suggestions={allowedTypes}
  />;

const SimpleTypeSelector = ({ type, onUpdate }) =>
  <TypeCombobox
    allowedTypes={['Custom', ...Object.keys(TypesServices.types)]}
    type={type}
    onUpdate={type => onUpdate(type === 'Custom' ? { base: 'string', allowedValues: [] } : type)}
  />;

const AdvancedTypeSelector = ({ type, onUpdate }) =>
  <div style={{ display: 'column', flexDirection: 'row' }}>
    <SimpleTypeSelector type={'Custom'} onUpdate={type => onUpdate(type)} />
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Input disabled value={'Base'} />
      <TypeCombobox
        type={type.base}
        allowedTypes={Object.keys(TypesServices.types)}
        onUpdate={base => onUpdate({ ...type, base })}
      />
    </div>
    <div
      data-comp="editable-list"
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}
    >
      <Input disabled value={'Allowed Values'} />
      <ReactTags
        tags={type.allowedValues.map(v => ({ id: v, text: v })) || []}
        handleAddition={newValue =>
          onUpdate({ ...type, allowedValues: [...type.allowedValues, newValue] })}
        handleDelete={index =>
          onUpdate({ ...type, allowedValues: R.remove(index, 1, type.allowedValues) })}
        placeholder="Add value"
        allowDeleteFromEmptyInput
        classNames={{
          tags: 'tags-container',
          tagInput: 'tag-input',
          tag: 'tag',
          remove: 'tag-delete-button',
          suggestions: 'tags-suggestion',
        }}
      />
    </div>
  </div>;

const PropertyTypeSelector = ({ type, onUpdate }) => {
  const TypeSelector = typeof type === 'object' ? AdvancedTypeSelector : SimpleTypeSelector;
  return <TypeSelector type={type} onUpdate={onUpdate} />;
};

export const IdentityPropertyItem = ({ name, def, onUpdate, onRemove }) =>
  <div data-comp="property-item">
    <button data-comp="remove" onClick={onRemove} />
    <Input disabled value={name} />
    <PropertyTypeSelector type={def.type} onUpdate={type => onUpdate({ ...def, type })} />
  </div>;

const createUpdater = (propName, updateFn) => x => updateFn(R.assoc(propName, x));
const EMPTY_IDENTITY = { propName: '', def: { type: 'string' } };
export const NewIdentityProperty = compose(
  withState('state', 'setState', EMPTY_IDENTITY),
  withHandlers({
    updatePropName: ({ setState }) => createUpdater('propName', setState),
    updateDef: ({ setState }) => createUpdater('def', setState),
    clear: ({ setState }) => () => setState(() => EMPTY_IDENTITY),
  }),
)(({ state, updateDef, updatePropName, onCreate, clear }) =>
  <div data-comp="new-property-item">
    <Input placeholder="Add new property" value={state.propName} onChange={updatePropName} />
    <PropertyTypeSelector
      type={state.def.type}
      onUpdate={type => updateDef({ ...state.def, type })}
    />
    <button
      data-comp="add"
      onClick={() => {
        onCreate(state.propName, state.def);
        clear();
      }}
    />
  </div>,
);
