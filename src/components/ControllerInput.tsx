import { Text, View, TextInput, Button, Alert } from "react-native";
import { Control, Controller, FieldError, FieldValues } from "react-hook-form";
import { InputProps } from "react-native-elements";

type Props = {
    control: Control<any>
    name: string
    label: string
    className?: string
    required?: boolean
    error?: FieldError | undefined
}

export default function ControllerInput({ control, name, label, className, required=false, error, ...rest }: Props) {

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
                        <TextInput
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            {...rest}
                        />
                    </View>
                )}

            />
            {error && <Text className="color-red-600">{error.message}</Text>}
        </View>
    );
}
