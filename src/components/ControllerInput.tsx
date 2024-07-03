import { Text, View } from "react-native";
import { Control, Controller, FieldError } from "react-hook-form";
import { TextInputProps } from "react-native";
import  MaskInput from 'react-native-mask-input' ;
import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

type Props = TextInputProps | {
    control: Control<any>
    name: string
    label: string
    style?: string
    required?: boolean
    error?: FieldError | undefined
    mask?:any
}

export default function ControllerInput({ control, name, label, style, 
    required=false, error, mask, inputRef, onSubmitEditing, ...rest }: any) {
        return (
        <View style={style}>
            <Controller
                name={name}
                control={control}
                rules={{
                    required: required,
                }}
                render={({ field: { onChange, onBlur,value } }: any) => (
                    <View style={styles.contianer}>
                        <Text style={{color: Colors.gray}}>{label}</Text>
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
            {error && <Text style={styles.textError}>{error.message}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    contianer:{
        width: '100%',
        height: 56,
        backgroundColor: 'rgba(156, 163, 175, 0.5)',
        borderRadius: 6,
        marginTop: 8,
        paddingLeft: 8
    },
    textError:{
        color: '#dc2626'
    }
})