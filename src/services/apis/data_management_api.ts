import supabase  from '../configs/supabase';

import { STATUS } from '../../assets/constants';
import { IProfileProps } from '../../redux/reducers';
interface IUserDataProps extends Omit<IProfileProps, 'profilePicture'> {}


export const DataManagementAPI =
{
    async addUserProfile({ email, profilePicture, name, dateOfBirth, instruments, level }: IProfileProps)
    {
        // Alternate way, to check for errors when using getUser.
        // const { user, error } = await supabase.auth.getUser();

        // if (error) {
        //     // Handle error
        //     throw error;
        // }
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data, error } = await supabase.from('users').insert({
                id: user.id, // Assuming your users table has an 'id' field that matches the user's uid
                email,
                profilePicture,
                name,
                dateOfBirth,
                instruments,
                level
            });

            if (error) {
                throw error;
            }

            return data;
        }
        else {
            throw new Error('User is not undefined. Cannot add user profile.');
        }
    },

    async updateUserProfile({ email, name, dateOfBirth, instruments, level }: IUserDataProps)
    {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data, error } = await supabase.from('users').upsert({
                id: user.id, // Assuming your users table has an 'id' field that matches the user's uid
                email,
                name,
                dateOfBirth,
                instruments,
                level
            });

            if (error) {
                throw error;
            }

            return data;
        }
        else {
            throw new Error('User is not undefined. Cannot update user profile.');
        }
    },

    async updateUserProfilePicture(profilePicture: string)
    {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data, error } = await supabase.from('users').upsert({
                id: user.id, // Assuming your users table has an 'id' field that matches the user's uid
                profilePicture
            });

            if (error) {
                throw error;
            }
            return data;
        }
        else {
            throw new Error('User is not undefined. Cannot update user profile picture.');
        }
    },

    async deleteUserData()
    {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            // User is authenticated, so delete user data
            const { data: practiceData, error: practiceError } = await supabase.from('practiceData').delete().eq('userId', user.id);
            if (practiceError) {
                // Handle practiceData deletion error
                throw practiceError;
            }

            const { data: musicPieces, error: musicError } = await supabase.from('musicPieces').delete().eq('userId', user.id);
            if (musicError) {
                // Handle musicPieces deletion error
                throw musicError;
            }

            // Delete user entry
            const { data: userData, error: userError } = await supabase.from('users').delete().eq('id', user.id);
            if (userError) {
                // Handle user deletion error
                throw userError;
            }
            return { practiceData, musicPieces, userData };
        } else {
            // User is not authenticated
            throw new Error('User is not authenticated. Cannot delete user data.');
        }
    },


    async saveMusicPiece(title: string, piece: string, composer: string, instrument: string, notes: string)
    {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            // User is authenticated, so save music piece
            // Assuming you have a 'music_pieces' table in your database
            const { data, error: insertError } = await supabase.from('music_pieces').upsert([
                { 
                    user_id: user.id, // Assuming your music_pieces table has a 'user_id' column to associate with the user
                    title,
                    piece,
                    composer,
                    instrument,
                    notes
                }
            ]);

            if (insertError) {
                // Handle insertion error
                throw insertError;
            }

            return data;
        }
        else {
            throw new Error('User is undefined. Cannot save music piece.');
        }
    },

    async getAllMusicPieces()
    {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            // User is authenticated, so get all music pieces for the user, //need .execute() at end of line?
            const { data: musicPieces, error: fetchError } = await supabase.from('music_pieces').select().eq('user_id', user.id);
            if (fetchError) {
                // Handle fetch error
                throw fetchError;
            }

            return musicPieces;
        }
        else {
            throw new Error('User is undefined. Cannot get music pieces.');
        }
    },


    async addPracticeData(title: string, piece: string, composer: string, instrument: string, practiceDate: Date, notes: string)
    {        
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            // User is authenticated, so add practice data
            // Assuming you have a 'practice_data' table in your database
            const { data, error } = await supabase.from('practice_data').insert([
                { 
                    user_id: user.id, // Assuming your practice_data table has a 'user_id' column to associate with the user
                    title,
                    piece,
                    composer,
                    instrument,
                    practice_date: practiceDate,
                    duration: 0,
                    status: STATUS[0],
                    notes
                }
            ]);
            if (error) {
                // Handle insertion error
                throw error;
            }
            // Save associated music piece
            await this.saveMusicPiece(title, piece, composer, instrument, notes);

            // Return the inserted practice data, need id?
            return data;
        }
        else {
            throw new Error('User is undefined. Cannot add practice data.');
        }
    },

    async updatePracticeDataByField(practiceId: string, updatedFields: Record<string, any>)
    {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            // Start of validation for Record object
            const keys = ['title', 'piece', 'composer', 'instrument', 'duration', 'status', 'notes'];
            const invalidFields = Object.keys(updatedFields).filter(key => !keys.includes(key));
            if (invalidFields.length > 0) {
                throw new Error('Invalid field names found in list of updates: ' + invalidFields.join(', '));
            }
            if ('status' in updatedFields && ![STATUS[0], STATUS[1], STATUS[2]].includes(updatedFields['status'])) {
                throw new Error("Invalid value found for 'status' field: " + updatedFields['status']);
            }
            // End of validation for Record object
    
            // Construct the update object
            const updateObject = { ...updatedFields, id: practiceId };
    
            // Perform the update operation
            const { data, error } = await supabase.from('practice_data').upsert(updateObject);
            if (error) {
                throw error;
            }
    
            return data; // Return the updated practice data, need ID?
        }
        else {
            throw new Error('User is undefined. Cannot update practice data.');
        }
    },

    async deletePracticeData(practiceId: string)
    {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            // Perform the delete operation
            const { data, error } = await supabase.from('practice_data').delete().eq('user_id', user.id);
            if (error) {
                throw error;
            }
            return data; // Return the response data
        }
        else {
            throw new Error('User is undefined. Cannot delete practice data.');
        }
    },


    async getAllPracticeDataByDate(dateStart: Date, dateEnd: Date)
    {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            // Perform the query operation
            const { data, error } = await supabase
                .from('practice_data')
                .select()
                .eq('user_id', user.id)
                .gte('practice_date', dateStart)
                .lte('practice_date', dateEnd);
            if (error) {
                throw error;
            }
    
            return data; // Return the retrieved practice data
        }
        else {
            throw new Error('User is undefined. Cannot get practice data.');
        }
    },

    async getCompletedPracticeDataByDate(dateStart: Date, dateEnd: Date)
    {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            // Perform the query operation
            const { data, error } = await supabase
                .from('practice_data')
                .select()
                .eq('user_id', user.id)
                .gte('practice_date', dateStart)
                .lte('practice_date', dateEnd)
                .eq('status', STATUS[2]);
    
            if (error) {
                throw error;
            }
            // Prepare the practice data and dates
            const practiceData: any[] = [];
            const practiceDataDates: { [date: string]: any } = {};
            data?.forEach((practiceDoc: any) => {
                // Assuming practiceDoc.practice_date is a date string
                const date = practiceDoc.practice_date.split('T')[0];
                practiceData.push({ id: practiceDoc.id, ...practiceDoc });
                practiceDataDates[date] = { marked: true, dotColor: 'red' };
            });
            return [practiceData, practiceDataDates]; // Return the completed practice data and dates
        } 
        else {
            throw new Error('User is undefined. Cannot get practice data.');
        }
    },

    async getPracticeHoursAndPiecesByDate(dateStart: Date, dateEnd: Date)
    {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            // Perform the query operation
            const { data, error } = await supabase
                .from('practice_data')
                .select('duration')
                .eq('user_id', user.id)
                .gte('practice_date', dateStart)
                .lte('practice_date', dateEnd);
            if (error) {
                throw error;
            }
            // Calculate total hours and pieces
            let hours = 0;
            let pieces = 0;
            data?.forEach((practiceDoc: any) => {
                if (practiceDoc.duration && practiceDoc.status !== STATUS[0]) {
                    hours += practiceDoc.duration;
                    pieces++;
                }
            });
            return [pieces, hours]; // Return the total pieces and hours
        }
        else {
            throw new Error('User is undefined. Cannot get practice data.');
        }
    },

    async getMostPracticedComposersByDate(dateStart: Date, dateEnd: Date)
    {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            // Perform the query operation
            const { data, error } = await supabase
                .from('practice_data')
                .select('composer, duration')
                .eq('user_id', user.id)
                .gte('practice_date', dateStart)
                .lte('practice_date', dateEnd)
                .gt('duration', 0); // Only consider practice data with positive duration
            if (error) {
                throw error;
            }
            // Calculate total practice hours per composer
            const composersMap = new Map<string, number>();
            data?.forEach((practiceDoc: any) => {
                const composer = practiceDoc.composer;
                const duration = practiceDoc.duration;
                composersMap.set(composer, (composersMap.get(composer) || 0) + duration);
            });
            // Sort composers by total practice hours
            const sortedComposers = Array.from(composersMap, ([composer, hour]) => ({ composer, hour })).sort((a, b) => b.hour - a.hour);
    
            return sortedComposers.slice(0, 5); // Return the top 5 most practiced composers
        }
        else {
            throw new Error('User is undefined. Cannot get practice data.');
        }
    },
};

