import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { Button, Input } from '@rneui/themed';

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signInLoading, setSignInLoading] = useState(false);
    const [signUpLoading, setSignUpLoading] = useState(false);
    const [signOutLoading, setSignOutLoading] = useState(false);
    const [session, setSession] = useState(null);

    // Check for existing session on component mount
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    async function signOut() {
        setSignOutLoading(true);
        const { error } = await supabase.auth.signOut();

        if (error) {
            Alert.alert('Sign out error', error.message);
        } else {
            setEmail('');
            setPassword('');
            Alert.alert('Signed out successfully!');
        }
        setSignOutLoading(false);
    }

    async function signInWithEmail() {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setSignInLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            Alert.alert('Sign in error', error.message);
        } else {
            Alert.alert('Signed in successfully!');
        }
        setSignInLoading(false);
    }

    async function signUpWithEmail() {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setSignUpLoading(true);
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            Alert.alert('Sign up error', error.message);
        } else {
            Alert.alert('Success', 'Please check your inbox for email verification!');
            setEmail('');
            setPassword('');
        }
        setSignUpLoading(false);
    }

    return (
        <View style={styles.container}>
            {session ? (
                <>
                    <View style={styles.verticallySpaced}>
                        <Button
                            title="Sign Out"
                            onPress={signOut}
                            loading={signOutLoading}
                            buttonStyle={styles.button}
                            type="outline"
                        />
                    </View>
                </>
            ) : (
                <>
                    <View style={[styles.verticallySpaced, styles.mt20]}>
                        <Input
                            label="Email"
                            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                            onChangeText={setEmail}
                            value={email}
                            placeholder="email@address.com"
                            autoCapitalize="none"
                            autoComplete="email"
                            keyboardType="email-address"
                        />
                    </View>
                    <View style={styles.verticallySpaced}>
                        <Input
                            label="Password"
                            leftIcon={{ type: 'font-awesome', name: 'lock' }}
                            onChangeText={setPassword}
                            value={password}
                            secureTextEntry={true}
                            placeholder="Password"
                            autoCapitalize="none"
                            autoComplete="password"
                        />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt20]}>
                        <Button
                            title="Sign in"
                            disabled={signInLoading || signUpLoading}
                            onPress={signInWithEmail}
                            buttonStyle={styles.button}
                            loading={signInLoading}
                        />
                    </View>
                    <View style={styles.verticallySpaced}>
                        <Button
                            title="Sign up"
                            disabled={signInLoading || signUpLoading}
                            onPress={signUpWithEmail}
                            buttonStyle={styles.button}
                            type="outline"
                            loading={signUpLoading}
                        />
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
    button: {
        borderRadius: 8,
        paddingVertical: 12,
    },
});