package com.example.firebase_20190925.service;

import com.example.firebase_20190925.model.Realdata;
import com.example.firebase_20190925.model.UserModel;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.http.GET;

public interface IApiService {
    @GET("api/json/get/ceFTpKSiwi?indent=2")
    Call<ArrayList<UserModel>> getUserList();

    @GET("user/show_all_users")
    Call<ArrayList<Realdata>> getrealDataList();
}
