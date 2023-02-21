import React from 'react';

import { InboxOutlined } from '@ant-design/icons';
import { Form, Popover, Upload } from 'antd';

import { CommonCard } from 'shared/ui/card';

import { Rtx2Rtttl } from 'features/rtx2mid/model/rtx2rtttl';
import { Rtttl2Mid } from 'features/rtx2mid/model/rtttl2mid';
import { useState } from 'react';

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};

const Rtx2MidConverterPage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState('');

    const downloadConvertedFile = (exportedMidi: File) => {
        const anchor = document.createElement('a');

        const reference = URL.createObjectURL(exportedMidi);

        anchor.download = exportedMidi.name;
        anchor.href = reference;
        anchor.click();

        requestAnimationFrame(() => URL.revokeObjectURL(reference));
    };

    const getExportedMidi = async (file: File) => {
        const buffer = new Uint8Array(await file.arrayBuffer());

        const binary = Array.from(buffer)
            .map((int) => int.toString(2).padStart(8, '0'))
            .join('');

        const rtx2rtttl = new Rtx2Rtttl();
        const rtttl = rtx2rtttl.convertToRtttl(binary);

        const rtttl2mid = new Rtttl2Mid();
        const exportedMidi = rtttl2mid.convertRtttlToMidiFile(rtttl);
        return exportedMidi;
    };

    const handleConvert = async (file: File) => {
        setIsOpen(false);

        try {
            const exportedMidi = await getExportedMidi(file);

            downloadConvertedFile(exportedMidi);

            setResults('Conversion successful!');
        } catch {
            setResults(
                'File is neither not a .rtl nor .mid that conforms to Nokia Ringtone Format',
            );
        }
        setIsOpen(true);
    };

    return (
        <CommonCard>
            <Popover content={results} title="Result" open={isOpen}>
                <Form
                    name="convert-rtx"
                    {...formItemLayout}
                    style={{ maxWidth: 600 }}>
                    <Form.Item label="Convert">
                        <Form.Item
                            name="dragger"
                            valuePropName="fileList"
                            noStyle
                            getValueFromEvent={({ file }) => {
                                handleConvert(file);
                            }}>
                            <Upload.Dragger
                                name="files"
                                maxCount={1}
                                beforeUpload={() => false}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                    Select a melody to convert
                                </p>
                                <p className="ant-upload-hint">
                                    Should be .rtl or .mid
                                </p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Popover>
        </CommonCard>
    );
};

export default Rtx2MidConverterPage;
