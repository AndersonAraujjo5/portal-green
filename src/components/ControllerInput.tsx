import { Text, View } from "react-native";
import { Control, Controller, FieldError } from "react-hook-form";
import { TextInputProps } from "react-native";
import  MaskInput from 'react-native-mask-input' ;

type Props = TextInputProps | {
    control: Control<any>
    name: string
    label: string
    className?: string
    required?: boolean
    error?: FieldError | undefined
    mask?:any
}

export default function ControllerInput({ control, name, label, className, 
    required=false, error, mask, inputRef, onSubmitEditing, ...rest }: any) {
        return (
        <View className={className}>
            <Controller
                name={name}
                control={control}
                rules={{
                    required: required,
                }}
                render={({ field: { onChange, onBlur,value } }: any) => (
                    <View className="w-full h-14 bg-gray-200 rounded-md ps-2 mt-4">
                        <Text className="text-gray-400">{label}</Text>
                        <MaskInput
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            mask={mask}
                            ref={inputRef}
                            returnKeyType={onSubmitEditing ? 'next' :'done'}
                            blurOnSubmit={onSubmitEditing ? false : true}
                            onSubmitEditing={() => onSubmitEditing && onSubmitEditing.current.focus()}
                            {...rest}
                        />
                    </View>
                )}

            />
            {error && <Text className="color-red-600">{error.message}</Text>}
        </View>
    );
}
