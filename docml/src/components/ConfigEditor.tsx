import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Table, message } from 'antd';
import React, { useCallback, useState } from 'react';
import type { ColumnType } from 'antd/es/table';

interface IConfigSection {
  section: string;
  description: string;
  example: string[];
}

interface IConfigEditorProps {
  visible: boolean;
  onClose: () => void;
  notebookPath: string;
  onSave: (sections: IConfigSection[]) => Promise<void>;
  initialSections: IConfigSection[];
}

/**
 * Component for editing modelcard.config sections
 */
export const ConfigEditor: React.FC<IConfigEditorProps> = ({
  visible,
  onClose,
  notebookPath,
  onSave,
  initialSections
}) => {
  const [sections, setSections] = useState<IConfigSection[]>(initialSections);
  const [loading, setLoading] = useState(false);

  const handleAddSection = useCallback(() => {
    setSections([...sections, { section: 'New Section', description: '', example: [] }]);
  }, [sections]);

  const handleRemoveSection = useCallback((index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  }, [sections]);

  const handleFieldChange = useCallback((index: number, field: keyof IConfigSection, value: string) => {
    const newSections = [...sections];
    if (field === 'example') {
      newSections[index][field] = value ? [value] : [];
    } else {
      newSections[index][field] = value as any;
    }
    setSections(newSections);
  }, [sections]);

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      await onSave(sections);
      message.success('Configuration saved successfully! Refresh to see changes.');
      onClose();
    } catch (error) {
      message.error('Failed to save configuration');
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  }, [sections, onSave, onClose]);

  const columns: ColumnType<IConfigSection & { key: number }>[] = [
    {
      title: 'Section Name',
      dataIndex: 'section',
      key: 'section',
      width: '30%',
      render: (text: string, record, index: number) => (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Input
            value={text}
            onChange={(e) => handleFieldChange(index, 'section', e.target.value)}
            placeholder="e.g., Data Cleaning, Model Training"
          />
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveSection(index)}
            title="Delete section"
          />
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '40%',
      render: (text: string, record, index: number) => (
        <Input.TextArea
          value={text}
          onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
          placeholder="Describe what this section should contain"
          rows={2}
          autoSize={{ minRows: 2, maxRows: 4 }}
        />
      ),
    },
    {
      title: 'Example URL',
      dataIndex: 'example',
      key: 'example',
      width: '30%',
      render: (examples: string[], record, index: number) => (
        <Input
          value={examples[0] || ''}
          onChange={(e) => handleFieldChange(index, 'example', e.target.value)}
          placeholder="https://example.com"
        />
      ),
    },
  ];

  const dataSource = sections.map((section, index) => ({
    ...section,
    key: index,
  }));

  return (
    <Modal
      title="Configure DocML Sections"
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="add" type="dashed" icon={<PlusOutlined />} onClick={handleAddSection}>
          Add Section
        </Button>,
        <Button
          key="save"
          type="primary"
          icon={<SaveOutlined />}
          loading={loading}
          onClick={handleSave}
        >
          Save Configuration
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <p>Configure sections for your DocML documentation. Changes will be saved to <code>modelcard.config</code>.</p>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
        size="small"
        scroll={{ y: 400 }}
      />
    </Modal>
  );
};
