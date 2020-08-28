/**
 * @jest-environment jsdom
 */
/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
import * as React from 'react';
import { shallow } from 'enzyme'

import { Profile, ProfileProps, ProfileStates } from '../reactjs/components/ProfileEditor/ProfileEditor'
import { mocked } from 'ts-jest/utils';
import { HttpClient } from '../reactjs/components/services/HttpClient';

jest.mock('../reactjs/components/services/HttpClient');
describe('Test profile component', () => {

    it('loads the component without crashing ', () => {
        const profileProps: ProfileProps =  {
            rpsServer: 'localhost:8081'
        }

        const wrapper = shallow(<Profile {...profileProps} />)
        expect(wrapper.find('Button')).toHaveLength(1)
    })

    it('should show the delete button on selecting a profile from the grid', ()=> {
        const profileProps: ProfileProps =  {
            rpsServer: 'localhost:8081'
        }

        const profileStates = {
            selectedDevices: [{
                ProfileName: 'profile1',
                AMTPassword: 'Password@123',
                GenerateRandomPassword: false,
                RandomPasswordLength: 8,
                Activation: 'ccmactivation'
            }]
        }

        const wrapper = shallow(<Profile {...profileProps} />)
        wrapper.setState(profileStates);
        wrapper.instance().forceUpdate();
        expect(wrapper.find('Button')).toHaveLength(2)
    })

    it('should load the confirmation popup on clicking delete button', () => {
        const profileProps: ProfileProps =  {
            rpsServer: 'localhost:8081'
        }

        const profileStates = {
            selectedDevices: [{
                ProfileName: 'profile1',
                AMTPassword: 'Password@123',
                GenerateRandomPassword: false,
                RandomPasswordLength: 8,
                Activation: 'ccmactivation'
            }],
            showPopup: true
        }

        const wrapper = shallow(<Profile {...profileProps} />)

        wrapper.setState(profileStates);
        wrapper.instance().forceUpdate();
        const deleteButton = wrapper.find('.btn-delete');
        deleteButton.simulate('click');
    })

    it('should call the delete api on confirmation', async () => {

        const profileProps: ProfileProps =  {
            rpsServer: 'localhost:8081'
        }

        const profileStates = {
            selectedDevices: [{
                ProfileName: 'profile1',
                AMTPassword: 'Password@123',
                GenerateRandomPassword: false,
                RandomPasswordLength: 8,
                Activation: 'ccmactivation'
            }],
            showPopup: true
        }
        mocked(HttpClient.delete).mockImplementation(() => Promise.resolve('Profile deleted'));

        const wrapper = shallow(<Profile {...profileProps} />)

        wrapper.setState(profileStates);
        wrapper.instance().forceUpdate();
        const instance = wrapper.instance() as Profile;
        expect(wrapper.state('showPopup')).toEqual(true);
        console.info(instance)
        instance.confirmDelete()
    })

    it('should open the flyout on click of create profile', () => {
        const profileProps: ProfileProps =  {
            rpsServer: 'localhost:8081'
        }
        const wrapper = shallow(<Profile {...profileProps} />)

        const newProfileButton = wrapper.find('.btn-create')
        newProfileButton.simulate('click')
        wrapper.setState({openFlyout: true});
        wrapper.instance().forceUpdate();
        expect(wrapper.state('openFlyout')).toEqual(true)
    })

    it('should show the create profile success notification', () => {
        const profileProps: ProfileProps =  {
            rpsServer: 'localhost:8081'
        }
        const wrapper = shallow(<Profile {...profileProps} />)
        const instance = wrapper.instance() as Profile;
        instance.createProfile(true, `Profile successfully inserted`);
       
       expect(wrapper.state('updateProfileGrid')).toEqual(true);
       expect(wrapper.state('showMessage')).toEqual(true);
       expect(wrapper.state('type')).toEqual('success')

    })

    it('should show the create profile error notification', () => {
        const profileProps: ProfileProps =  {
            rpsServer: 'localhost:8081'
        }
        const wrapper = shallow(<Profile {...profileProps} />)
        const instance = wrapper.instance() as Profile;
        instance.createProfile(false, `Failed to insert profile`);
        
        expect(wrapper.state('updateProfileGrid')).toEqual(false);
        expect(wrapper.state('showMessage')).toEqual(true);
        expect(wrapper.state('type')).toEqual('error')
    })
})