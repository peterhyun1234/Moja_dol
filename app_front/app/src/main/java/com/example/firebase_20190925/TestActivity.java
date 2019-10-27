package com.example.firebase_20190925;

import android.os.Bundle;
import android.util.Log;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.firebase_20190925.adapter.UserAdapter;
import com.example.firebase_20190925.model.UserModel;
import com.example.firebase_20190925.service.IApiService;
import com.example.firebase_20190925.service.RestClient;
import com.facebook.stetho.Stetho;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class TestActivity extends AppCompatActivity {
    private String mClassName = getClass().getName().trim();
    private RecyclerView mRecyclerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Stetho.initializeWithDefaults(this);
        setContentView(R.layout.activity_test);

        mRecyclerView=findViewById(R.id.recycler_view);
        mRecyclerView.setLayoutManager(new LinearLayoutManager(this));

        IApiService iApiService=new RestClient("http://www.json-generator.com/").getApiService();
        Call<ArrayList<UserModel>> call = iApiService.getUserList();
        try {
            call.enqueue(new Callback<ArrayList<UserModel>>() {
                @Override
                public void onResponse(Call<ArrayList<UserModel>> call, Response<ArrayList<UserModel>> response) {
                    if (response.isSuccessful()) {

                        try {
                            UserAdapter ua = new UserAdapter(response.body());
                            //String tmp=response.body()
                            Log.d("받아온 데이터123","성공"+response.body().toString());
                            Log.d("받아오기","성공");
                           // Log.d("받아온 데이터","성공"+response.body().);
                           // Log.d("바디명",""+tmp);
                            mRecyclerView.setAdapter(ua);
                        }
                        catch(Exception e) {
                            Log.d("예외",""+response.body().toString());
                            Log.d(mClassName, e.toString());
                        }
                    }
                }

                @Override
                public void onFailure(Call<ArrayList<UserModel>> call, Throwable t) {

                    Log.d("실패", t.getMessage());
                }
            });
        }
        catch(Exception e) {
            Log.d(mClassName, e.getMessage());
        }
    }
}
